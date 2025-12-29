# Ingestion Agent Manual

NotebookLM cannot read Instagram directly because of the login screen.
This "Agent" (Script) solves it by using a special tool (`yt-dlp`) to extract the text descriptions/captions from the videos without you needing to copy-paste them manually.

## Setup
1.  Ensure you have **Python** installed.
2.  Open your terminal/command prompt.
3.  Install the harvester engine:
    ```powershell
    pip install yt-dlp
    ```

## How to use
1.  Open the file: `c:\Orquestador\agents\ingestion\urls.txt`
2.  **PASTE** all your 50-100 Instagram/YouTube URLs there (one per line).
3.  Run the agent:
    ```powershell
    python c:\Orquestador\agents\ingestion\harvest.py
    ```
4.  Wait for it to finish.
5.  Pick up the result file: `c:\Orquestador\agents\ingestion\notebooklm_source.txt`
6.  Upload that file to **NotebookLM**.

## Troubleshooting
If it still fails due to "Login Required", standard scraping is fully blocked by Meta.
**Alternative**: search for "Mass Instagram Downloader" online, download the videos, and upload the MP4/Audio files to NotebookLM directly.
