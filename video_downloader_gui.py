import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import threading
import subprocess
import sys
import os

class DownloaderApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Video Downloader for NotebookLM")
        self.root.geometry("600x500")
        
        # Configure styles
        style = ttk.Style()
        style.configure("TButton", padding=5)
        style.configure("TLabel", padding=5)
        
        # Main Container
        main_frame = ttk.Frame(root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_label = ttk.Label(main_frame, text="Video Downloader (YouTube & Instagram)", font=("Helvetica", 12, "bold"))
        title_label.pack(pady=5)
        
        # Input Area Label
        input_label = ttk.Label(main_frame, text="Pega las URLs (una por línea) o carga un archivo .txt:")
        input_label.pack(anchor=tk.W)
        
        # Text Area for URLs
        self.text_area = tk.Text(main_frame, height=10, width=60)
        self.text_area.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # Buttons Frame
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(fill=tk.X, pady=5)
        
        self.load_btn = ttk.Button(btn_frame, text="Cargar archivo .txt", command=self.load_file)
        self.load_btn.pack(side=tk.LEFT, padx=5)
        
        self.clear_btn = ttk.Button(btn_frame, text="Limpiar", command=self.clear_text)
        self.clear_btn.pack(side=tk.LEFT, padx=5)
        
        # Progress Bar
        self.progress_bar = ttk.Progressbar(main_frame, orient=tk.HORIZONTAL, length=100, mode='determinate')
        self.progress_bar.pack(fill=tk.X, pady=10)
        
        # Status Label
        self.status_var = tk.StringVar(value="Listo")
        self.status_label = ttk.Label(main_frame, textvariable=self.status_var)
        self.status_label.pack()
        
        # Download Button
        self.download_btn = ttk.Button(main_frame, text="DESCARGAR VIDEOS", command=self.start_download_thread)
        self.download_btn.pack(pady=10, fill=tk.X)
        
        # Settings
        self.download_dir = os.path.join(os.getcwd(), "agents", "ingestion", "downloads")
        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir)

    def load_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("Text files", "*.txt")])
        if file_path:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    self.text_area.delete("1.0", tk.END)
                    self.text_area.insert(tk.END, content)
                self.status_var.set(f"Archivo cargado: {os.path.basename(file_path)}")
            except Exception as e:
                messagebox.showerror("Error", f"No se pudo leer el archivo: {e}")

    def clear_text(self):
        self.text_area.delete("1.0", tk.END)
        self.status_var.set("Listo")

    def start_download_thread(self):
        urls = self.text_area.get("1.0", tk.END).strip().split('\n')
        urls = [url.strip() for url in urls if url.strip()]
        
        if not urls:
            messagebox.showwarning("Atención", "Por favor, introduce al menos una URL.")
            return
            
        self.download_btn.config(state=tk.DISABLED)
        self.load_btn.config(state=tk.DISABLED)
        self.clear_btn.config(state=tk.DISABLED)
        
        thread = threading.Thread(target=self.run_download, args=(urls,))
        thread.daemon = True
        thread.start()

    def run_download(self, urls):
        total = len(urls)
        archive_file = os.path.join(os.getcwd(), "agents", "ingestion", "downloaded_archive.txt")
        
        for i, url in enumerate(urls):
            self.status_var.set(f"Descargando ({i+1}/{total}): {url}")
            self.progress_bar['value'] = (i / total) * 100
            self.root.update_idletasks()
            
            cmd = [
                sys.executable, "-m", "yt_dlp",
                "-o", f"{self.download_dir}/%(uploader)s - %(title).50s.%(ext)s",
                "--no-playlist",
                "--merge-output-format", "mp4",
                "--download-archive", archive_file,
                "--write-auto-sub",
                "--skip-unavailable-fragments",
                "--quiet",
                url
            ]
            
            try:
                subprocess.run(cmd, check=False)
            except Exception as e:
                print(f"Error con {url}: {e}")
                
        self.progress_bar['value'] = 100
        self.status_var.set("¡DESCARGA COMPLETADA!")
        messagebox.showinfo("Éxito", f"Descarga terminada.\nArchivos en: {self.download_dir}")
        
        self.download_btn.config(state=tk.NORMAL)
        self.load_btn.config(state=tk.NORMAL)
        self.clear_btn.config(state=tk.NORMAL)

if __name__ == "__main__":
    root = tk.Tk()
    app = DownloaderApp(root)
    root.mainloop()
