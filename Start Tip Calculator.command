#!/bin/bash
# ─────────────────────────────────────────────
# Tip Calculator PWA — Double-click to launch Web UI
# ─────────────────────────────────────────────

DIR="$(cd "$(dirname "$0")" && pwd)"
PORT=8093

# Stop any previous instance on this port
lsof -ti:$PORT 2>/dev/null | xargs kill 2>/dev/null
sleep 1

echo "Starting Tip Calculator PWA..."
cd "$DIR"
nohup python3 pwa/serve.py > /tmp/tip_calculator.log 2>&1 &
sleep 2
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "✓ Tip Calculator started on port $PORT"
else
    echo "✗ Failed to start. Check /tmp/tip_calculator.log"
    read -p "Press Enter to close..."
    exit 1
fi

open -a "Google Chrome" "http://localhost:$PORT"

sleep 2
osascript -e 'tell application "Terminal" to close front window' &
exit 0
