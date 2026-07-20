#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# ─── How to run ───
# uv run tools/build_corpus_coverage.py --corpus /path/to/data --output references/local/corpus-coverage.json
"""Build a deterministic, source-preserving inventory of a local prompt corpus."""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Final


SCHEMA_VERSION: Final = 1


@dataclass(frozen=True, slots=True)
class SourceFile:
    """Stable metadata proving a source file was included without copying its content."""

    path: str
    bytes: int
    lines: int
    sha256: str
    records: int | None


def record_count(path: Path, text: str) -> int | None:
    """Return a structured-record count when the source format has one."""
    match path.suffix.lower():
        case ".jsonl":
            return sum(1 for line in text.splitlines() if line.strip())
        case ".json":
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError as exc:
                raise SystemExit(f"Invalid JSON in {path}: {exc}")
            if isinstance(parsed, list):
                return len(parsed)
            return 1
        case _:
            return None


def source_file(corpus: Path, path: Path) -> SourceFile:
    """Read one corpus file and derive content-independent coverage metadata."""
    raw = path.read_bytes()
    text = raw.decode("utf-8", errors="replace")
    return SourceFile(
        path=path.relative_to(corpus).as_posix(),
        bytes=len(raw),
        lines=text.count("\n") + (1 if text else 0),
        sha256=hashlib.sha256(raw).hexdigest(),
        records=record_count(path, text),
    )


def build_manifest(corpus: Path) -> dict[str, object]:
    """Build a sorted manifest for every regular file below a corpus root."""
    files = [source_file(corpus, path) for path in sorted(corpus.rglob("*")) if path.is_file()]
    return {
        "schema_version": SCHEMA_VERSION,
        "source_root": str(corpus),
        "file_count": len(files),
        "files": [asdict(file) for file in files],
    }


def main() -> int:
    """Run the corpus inventory builder."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    if not args.corpus.is_dir():
        raise SystemExit(f"Corpus directory does not exist: {args.corpus}")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(build_manifest(args.corpus), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
