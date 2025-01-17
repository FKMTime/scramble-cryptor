use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

fn get_default_downloads_path() -> Option<PathBuf> {
    dirs::download_dir()
}

#[tauri::command]
fn save_encrypted_scrambles(json: &str, file_name: &str) -> String {
    if let Some(downloads_dir) = get_default_downloads_path() {
        let mut file_path = downloads_dir;
        file_path.push(file_name);

        match File::create(&file_path) {
            Ok(mut file) => {
                if let Err(e) = file.write_all(json.as_bytes()) {
                    return format!("Error writing to file: {:?}", e);
                }
                "File saved successfully".to_string()
            }
            Err(e) => format!("Error creating file: {:?}", e),
        }
    } else {
        "Downloads directory not found".to_string()
    }
}

#[tauri::command]
fn save_passwords_txt(txt: &str, file_name: &str) -> String {
    if let Some(downloads_dir) = get_default_downloads_path() {
        let mut file_path = downloads_dir;
        file_path.push(file_name);

        match File::create(&file_path) {
            Ok(mut file) => {
                if let Err(e) = file.write_all(txt.as_bytes()) {
                    return format!("Error writing to file: {:?}", e);
                }
                "File saved successfully".to_string()
            }
            Err(e) => format!("Error creating file: {:?}", e),
        }
    } else {
        "Downloads directory not found".to_string()
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![save_encrypted_scrambles, save_passwords_txt])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
