#!/usr/bin/env bash
#
# Deploy the Tip Calculator PWA to GitHub Pages.
#
# What it does:
#   1. (optional) commits your pending changes if you pass a message
#   2. pushes the `main` branch
#   3. rebuilds the `gh-pages` branch from the pwa/ folder (app files at root)
#   4. force-pushes gh-pages — GitHub Pages redeploys automatically
#
# Usage:
#   ./deploy.sh                       # deploy; requires a clean working tree
#   ./deploy.sh "your commit message" # commit everything first, then deploy
#
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

MAIN_BRANCH="main"
PAGES_BRANCH="gh-pages"
APP_PREFIX="pwa"
SITE_URL="https://summerbb138.github.io/TipCalculatorPWA/"

# 1. Handle uncommitted changes.
if [ -n "$(git status --porcelain)" ]; then
  if [ "$#" -ge 1 ]; then
    echo "→ Committing pending changes: $*"
    git add -A
    git commit -q -m "$*"
  else
    echo "✗ You have uncommitted changes. Either:"
    echo "    • commit them yourself, then re-run ./deploy.sh"
    echo "    • or let this script commit them:  ./deploy.sh \"your message\""
    echo
    git status --short
    exit 1
  fi
fi

# 2. Push main.
echo "→ Pushing $MAIN_BRANCH ..."
git push origin "$MAIN_BRANCH"

# 3. Rebuild gh-pages from the pwa/ folder (app files land at the branch root).
echo "→ Rebuilding $PAGES_BRANCH from $APP_PREFIX/ ..."
git branch -D "$PAGES_BRANCH" 2>/dev/null || true
git subtree split --prefix "$APP_PREFIX" -b "$PAGES_BRANCH" >/dev/null

# 4. Publish.
echo "→ Publishing $PAGES_BRANCH ..."
git push -f origin "$PAGES_BRANCH"

echo
echo "✓ Deployed. GitHub Pages rebuilds in ~1 minute:"
echo "    $SITE_URL"
