#!/usr/bin/env bash
# ==============================================================================
# OUTSIDE APPAREL STUDIO — Automated Database & Store Backup Utility (Bash)
# ==============================================================================
set -euo pipefail

BACKUP_DIR="${1:-backups}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TARGET_DIR="$PROJECT_ROOT/$BACKUP_DIR"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

mkdir -p "$TARGET_DIR"

echo "=========================================================="
echo " OUTSIDE APPAREL STUDIO — SYSTEM BACKUP: $TIMESTAMP"
echo "=========================================================="

# 1. Local Store JSON Snapshot
STORE_FILE="$PROJECT_ROOT/data/store.json"
if [ -f "$STORE_FILE" ]; then
    STORE_BACKUP="$TARGET_DIR/store_${TIMESTAMP}.json"
    cp "$STORE_FILE" "$STORE_BACKUP"
    STORE_HASH=$(sha256sum "$STORE_BACKUP" | awk '{print $1}')
    echo "[✓] Store snapshot created: $STORE_BACKUP"
    echo "    SHA256: $STORE_HASH"
fi

# 2. PostgreSQL Dump (if DATABASE_URL is configured)
if [ -n "${DATABASE_URL:-}" ]; then
    echo "[*] DATABASE_URL detected. Initiating pg_dump..."
    PG_BACKUP="$TARGET_DIR/postgres_${TIMESTAMP}.sql"
    if command -v pg_dump >/dev/null 2>&1; then
        pg_dump --clean --if-exists --no-owner --no-privileges "$DATABASE_URL" > "$PG_BACKUP"
        PG_HASH=$(sha256sum "$PG_BACKUP" | awk '{print $1}')
        echo "[✓] PostgreSQL dump created: $PG_BACKUP"
        echo "    SHA256: $PG_HASH"
    else
        echo "[!] pg_dump utility not found in PATH."
    fi
fi

echo "[✓] BACKUP COMPLETE."
