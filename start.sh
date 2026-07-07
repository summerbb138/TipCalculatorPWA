#!/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PROJECT_DIR"

echo "Starting Tip Calculator PWA..."
echo "Open: http://localhost:8093"
exec python3 pwa/serve.py
