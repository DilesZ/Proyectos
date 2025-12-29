import os
import subprocess
import json
import sys

# Requirements: pip install yt-dlp

def harvest_descriptions(url_file, output_file):
    """
    Reads a list of URLs from url_file.
    Uses yt-dlp to extract the description (caption) of each video.
    Writes all combined text to output_file.
    """
    
    # Check if yt-dlp is installed
    try:
        subprocess.run([sys.executable, "-m", "yt_dlp", "--version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("ERROR: 'yt-dlp' is not installed.")
        print("Please install it by running: pip install yt-dlp")
        return

    print(f"Reading URLs from {url_file}...")
    
    with open(url_file, 'r') as f:
        urls = [line.strip() for line in f if line.strip()]

    print(f"Found {len(urls)} URLs. Starting harvest...")

    combined_text = "# INSTAGRAM CONTENT EXPORT\n\n"

    for i, url in enumerate(urls):
        print(f"[{i+1}/{len(urls)}] Processing: {url}")
        
        # Command to get JSON metadata without downloading video
        cmd = [
            sys.executable, "-m", "yt_dlp",
            "--dump-single-json",
            "--skip-download",
            url
        ]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
            if result.returncode == 0:
                data = json.loads(result.stdout)
                description = data.get('description', 'No description found.')
                uploader = data.get('uploader', 'Unknown User')
                
                entry = f"## VIDEO {i+1} ({uploader})\nURL: {url}\n\nCONTENT:\n{description}\n\n---\n\n"
                combined_text += entry
            else:
                error_msg = f"## VIDEO {i+1} (ERROR)\nURL: {url}\n\nCould not extract data. (Login might be required or link invalid)\n\n---\n\n"
                combined_text += error_msg
                print(f"Warning: Failed to process {url}")
                
        except Exception as e:
            print(f"Error processing {url}: {e}")

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(combined_text)
        print(f"SUCCESS! All content saved to: {output_file}")
        print("You can now upload this file to NotebookLM.")
    except Exception as e:
        print(f"Error writing output file: {e}")

if __name__ == "__main__":
    # Default file paths
    INPUT_LIST = r"c:\Orquestador\agents\ingestion\urls.txt"
    OUTPUT_TEXT = r"c:\Orquestador\agents\ingestion\notebooklm_source.txt"
    
    # Create dummy input file if not exists
    if not os.path.exists(INPUT_LIST):
        with open(INPUT_LIST, 'w') as f:
            f.write("# Paste your Instagram URLs here, one per line\n")
        print(f"Created input file at: {INPUT_LIST}")
        print("Please paste your URLs there and run this script again.")
    else:
        harvest_descriptions(INPUT_LIST, OUTPUT_TEXT)
