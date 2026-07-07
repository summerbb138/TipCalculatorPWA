#!/usr/bin/env python3
"""PWA dev server. Run from project root: bash start.sh"""
import http.server
import os
import socketserver

PORT = 8093
DIR = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIR)
socketserver.TCPServer.allow_reuse_address = True

print(f"Serving PWA on http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as s:
    s.serve_forever()
