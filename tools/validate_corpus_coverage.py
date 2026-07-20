#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# ─── How to run ───
# uv run tools/validate_corpus_coverage.py --corpus /path/to/data --coverage references/corpus-coverage.json
"""Verify that a coverage manifest exactly represents a local source tree."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def fingerprint(path: Path) -> tuple[int, str]:
    """Return the two source attributes that detect content drift."""
    raw = path.read_bytes()
    return len(raw), hashlib.sha256(raw).hexdigest()


def main() -> int:
    """Compare actual corpus files against their checked-in coverage inventory."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", required=True, type=Path)
    parser.add_argument("--coverage", required=True, type=Path)
    args = parser.parse_args()
    if not args.corpus.is_dir():
        raise SystemExit(f"Corpus directory does not exist: {args.corpus}")
    manifest = json.loads(args.coverage.read_text(encoding="utf-8"))
    entries = manifest.get("files")
    if not isinstance(entries, list):
        raise SystemExit("Coverage manifest must contain a files list")

    actual = {path.relative_to(args.corpus).as_posix(): path for path in args.corpus.rglob("*") if path.is_file()}
    covered: dict[str, dict[str, object]] = {}
    errors: list[str] = []
    for entry in entries:
        if not isinstance(entry, dict) or not isinstance(entry.get("path"), str):
            errors.append("invalid manifest entry")
            continue
        relative = entry["path"]
        if relative in covered:
            errors.append(f"duplicate coverage entry: {relative}")
        covered[relative] = entry
    for relative, path in actual.items():
        entry = covered.get(relative)
        if entry is None:
            errors.append(f"missing coverage entry: {relative}")
            continue
        size, digest = fingerprint(path)
        if entry.get("bytes") != size or entry.get("sha256") != digest:
            errors.append(f"source drift: {relative}")
    for relative in covered:
        if relative not in actual:
            errors.append(f"stale coverage entry: {relative}")
    result = {
        "ok": not errors,
        "actual_file_count": len(actual),
        "coverage_file_count": len(covered),
        "errors": errors,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
