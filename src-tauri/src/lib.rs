use std::io::{BufRead, BufReader, Write};
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::State;
use uuid::Uuid;

struct NekoProcess(Mutex<Option<Child>>);

#[derive(Serialize, Deserialize)]
struct SdkMessage {
    id: String,
    #[serde(rename = "type")]
    msg_type: String,
    payload: String,
}

#[tauri::command]
fn start_neko(state: State<'_, NekoProcess>) -> Result<String, String> {
    let mut guard = state.0.lock().map_err(|e| e.to_string())?;

    if guard.is_some() {
        return Err("already running".into());
    }

    let child = Command::new("neko")
        .arg("sdk")
        .arg("--output-format")
        .arg("json")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| format!("spawn neko failed: {e}"))?;

    *guard = Some(child);
    Ok("started".into())
}

#[tauri::command]
fn send_message(state: State<'_, NekoProcess>, text: String) -> Result<String, String> {
    let mut guard = state.0.lock().map_err(|e| e.to_string())?;
    let child = guard.as_mut().ok_or("neko not running")?;

    let stdin = child.stdin.as_mut().ok_or("no stdin")?;
    let stdout = child.stdout.as_mut().ok_or("no stdout")?;

    let msg = SdkMessage {
        id: Uuid::new_v4().to_string(),
        msg_type: "message".into(),
        payload: text,
    };

    let mut line = String::new();
    let mut reader = BufReader::new(stdout);

    // Send
    let json = serde_json::to_string(&msg).map_err(|e| e.to_string())?;
    writeln!(stdin, "{json}").map_err(|e| e.to_string())?;
    stdin.flush().map_err(|e| e.to_string())?;

    // Read text response
    line.clear();
    reader.read_line(&mut line).map_err(|e| e.to_string())?;
    let resp: SdkMessage = serde_json::from_str(&line).map_err(|e| e.to_string())?;

    // Read done marker
    line.clear();
    reader.read_line(&mut line).ok();

    Ok(resp.payload)
}

#[tauri::command]
fn stop_neko(state: State<'_, NekoProcess>) -> Result<(), String> {
    let mut guard = state.0.lock().map_err(|e| e.to_string())?;
    if let Some(mut child) = guard.take() {
        let _ = child.kill();
        let _ = child.wait();
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(NekoProcess(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![start_neko, send_message, stop_neko])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
