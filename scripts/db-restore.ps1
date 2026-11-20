# ==============================================================================
# OUTSIDE APPAREL STUDIO — Automated Database & Store Restore Utility
# Mode: Safe Point-In-Time Restoration with Pre-Restore Safety Snapshot
# ==============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $BackupFile)) {
    Write-Error "Backup file not found at: $BackupFile"
}

Write-Host "==========================================================" -ForegroundColor Red
Write-Host " OUTSIDE RESTORATION WATCHDOG" -ForegroundColor Red
Write-Host " Target File: $BackupFile" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Red

# 1. Take safety pre-restore backup first
$SafetyScript = Join-Path $PSScriptRoot "db-backup.ps1"
if (Test-Path $SafetyScript) {
    Write-Host "[*] Creating safety pre-restore snapshot..." -ForegroundColor Cyan
    & $SafetyScript -BackupDir "backups/pre_restore_safety" | Out-Null
}

# 2. Restore JSON store if JSON
if ($BackupFile.EndsWith(".json")) {
    $DestStore = Join-Path $PSScriptRoot "..\data\store.json"
    Copy-Item -Path $BackupFile -Destination $DestStore -Force
    Write-Host "[✓] Restored store.json successfully from $BackupFile" -ForegroundColor Green
}

# 3. Restore PostgreSQL if SQL
if ($BackupFile.EndsWith(".sql") -and $env:DATABASE_URL) {
    Write-Host "[*] Restoring PostgreSQL from SQL dump..." -ForegroundColor Cyan
    psql $env:DATABASE_URL < $BackupFile
    Write-Host "[✓] PostgreSQL database restored successfully." -ForegroundColor Green
}

Write-Host "[✓] RESTORATION FINISHED." -ForegroundColor Green
