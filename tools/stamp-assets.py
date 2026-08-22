#!/usr/bin/env python3
"""Stamp the CSS/JS links in index.html with a hash of their contents.

Images keep a year-long immutable cache because they rarely change. The
stylesheet and script do change, and a browser holding an `immutable` copy will
not revalidate it — only a different URL forces a refetch. Hashing the query
string means every edit ships a new URL, so returning visitors always get the
current file while unchanged files still cache.

Run after editing assets/css/styles.css or assets/js/main.js.
"""
import hashlib, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
html = root / "index.html"
s = html.read_text()

for rel in ("assets/css/styles.css", "assets/js/main.js"):
    digest = hashlib.sha256((root / rel).read_bytes()).hexdigest()[:10]
    pattern = re.compile(re.escape(rel) + r"(?:\?v=[0-9a-f]+)?")
    if not pattern.search(s):
        sys.exit(f"no reference to {rel} in index.html")
    s = pattern.sub(f"{rel}?v={digest}", s)
    print(f"{rel} -> ?v={digest}")

html.write_text(s)
