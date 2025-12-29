# Video Downloader Agent (Fast Batch)
$URL_FILE = "c:\Orquestador\agents\ingestion\urls.txt"
$DOWNLOAD_DIR = "c:\Orquestador\agents\ingestion\downloads"
$ARCHIVE_FILE = "c:\Orquestador\agents\ingestion\downloaded_archive.txt"

if (-not (Test-Path $DOWNLOAD_DIR)) {
    New-Item -ItemType Directory -Path $DOWNLOAD_DIR
}

Write-Host "Starting Fast Batch Download..." -ForegroundColor Cyan

# Using python -m yt_dlp with archive to skip already downloaded videos
# Added --write-auto-sub for better NotebookLM context
python -m yt_dlp `
    -a $URL_FILE `
    -o "$DOWNLOAD_DIR/%(uploader)s - %(title).50s.%(ext)s" `
    --no-playlist `
    --merge-output-format mp4 `
    --download-archive $ARCHIVE_FILE `
    --write-auto-sub `
    --skip-unavailable-fragments `
    --quiet --progress

Write-Host "`nDONE! Videos and transcripts are in: $DOWNLOAD_DIR" -ForegroundColor Green
Write-Host "Now, go to NotebookLM and UPLOAD all those .mp4 and .vtt files directly." -ForegroundColor Yellow
