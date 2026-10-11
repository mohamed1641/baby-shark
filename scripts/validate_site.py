#!/usr/bin/env python3
"""Check static local links, referenced images, and HTML anchors. No dependencies."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))
EXTERNAL_SCHEMES = {"http", "https", "mailto", "tel", "sms", "data", "javascript"}


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[tuple[str, str]] = []
        self.ids: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        for attribute in ("href", "src"):
            if values.get(attribute):
                self.links.append((attribute, values[attribute]))


def main() -> int:
    problems: list[str] = []
    parsed: dict[Path, SiteParser] = {}
    for page in HTML_FILES:
        parser = SiteParser()
        parser.feed(page.read_text(encoding="utf-8"))
        parsed[page.resolve()] = parser

    if not HTML_FILES or not (ROOT / "index.html").is_file():
        problems.append("index.html or HTML pages missing")

    for page, parser in parsed.items():
        for attribute, raw in parser.links:
            url = urlsplit(raw)
            if url.scheme.lower() in EXTERNAL_SCHEMES or url.netloc:
                continue
            rel = unquote(url.path)
            target = (page.parent / rel).resolve() if rel else page
            if not target.is_relative_to(ROOT):
                problems.append(f"{page.name}: path outside project: {raw}")
            elif not target.exists():
                problems.append(f"{page.name}: missing {attribute} target: {raw}")
            elif url.fragment and target in parsed and unquote(url.fragment) not in parsed[target].ids:
                problems.append(f"{page.name}: missing anchor: {raw}")

    # Check local CSS url() references (fonts, backgrounds, etc.).
    for css in (ROOT / "assets/css").rglob("*.css"):
        content = css.read_text(encoding="utf-8")
        for token in re.findall(r"url\(\s*['\"]?([^'\")]+)", content):
            url = urlsplit(token.strip())
            if url.scheme or url.netloc or not url.path or url.path.startswith("#"):
                continue
            dest = (css.parent / unquote(url.path)).resolve()
            if not dest.is_relative_to(ROOT) or not dest.exists():
                problems.append(f"{css.relative_to(ROOT)}: missing CSS URL: {token}")

    # Catalog image paths are set by JS dynamically and do not appear in HTML src.
    js = (ROOT / "assets/js/main.js").read_text(encoding="utf-8")
    for image in set(re.findall(r"assets/images/[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp)", js)):
        if not (ROOT / image).is_file():
            problems.append(f"main.js: missing image: {image}")

    # GitHub blocks files bigger than 100 MiB.
    for file in ROOT.rglob("*"):
        if file.is_file() and file.stat().st_size > 100 * 1024 * 1024:
            problems.append(f"GitHub 100-MiB file limit exceeded: {file.relative_to(ROOT)}")

    if problems:
        print("Site validation failed:")
        for problem in problems:
            print(" -", problem)
        return 1
    print(f"Site validation passed: {len(parsed)} pages, links, assets, and anchors OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
