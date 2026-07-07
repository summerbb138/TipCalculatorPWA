#!/usr/bin/env bash
#
# Regenerate docs/SYSTEM_DOCUMENTATION.pdf from the markdown source.
#
# Keeps the PDF in sync with SYSTEM_DOCUMENTATION.md. Run it after editing
# the markdown, or let deploy.sh call it automatically when the .md is newer.
#
# Pipeline: pandoc (markdown -> docx) -> LibreOffice headless (docx -> pdf).
# Note the `-f gfm-tex_math_dollars` reader: without it, pandoc treats the
# "$" signs in the doc as LaTeX math delimiters and mangles the text.
#
# Requires: pandoc, and LibreOffice's `soffice` (both via Homebrew).
#
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$REPO_DIR/docs"
BASENAME="SYSTEM_DOCUMENTATION"
MD="$DOCS_DIR/$BASENAME.md"
PDF="$DOCS_DIR/$BASENAME.pdf"

for tool in pandoc soffice; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "✗ Missing '$tool'. Install with: brew install ${tool/soffice/--cask libreoffice}"
    exit 1
  fi
done

if [ ! -f "$MD" ]; then
  echo "✗ Source not found: $MD"
  exit 1
fi

cd "$DOCS_DIR"
TMP_DOCX="$(mktemp -t "$BASENAME").docx"
trap 'rm -f "$TMP_DOCX"' EXIT

echo "→ pandoc: $BASENAME.md -> docx ..."
pandoc -f gfm-tex_math_dollars "$MD" -o "$TMP_DOCX"

echo "→ LibreOffice: docx -> pdf ..."
soffice --headless --convert-to pdf --outdir "$DOCS_DIR" "$TMP_DOCX" >/dev/null 2>&1

# LibreOffice names the output after the temp file; move it into place.
GENERATED="$DOCS_DIR/$(basename "${TMP_DOCX%.docx}").pdf"
mv -f "$GENERATED" "$PDF"

echo "✓ Regenerated: docs/$BASENAME.pdf"
