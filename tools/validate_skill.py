#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# ─── How to run ───
# uv run tools/validate_skill.py SKILL.md README.md README.ko.md references/corpus-coverage.json
"""Validate the published skill's metadata and local Markdown references."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


FRONT_MATTER_FIELDS = ("name:", "description:")
REFERENCE_LINK = re.compile(r"\]\((references/[^)#]+)")


def validate_front_matter(skill: Path, errors: list[str]) -> None:
    """Confirm the Codex-consumed SKILL.md metadata envelope is present."""
    lines = skill.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0] != "---":
        errors.append("SKILL.md must start with YAML front matter")
        return
    try:
        end = lines.index("---", 1)
    except ValueError:
        errors.append("SKILL.md YAML front matter is not closed")
        return
    front_matter = lines[1:end]
    for field in FRONT_MATTER_FIELDS:
        if not any(line.startswith(field) for line in front_matter):
            errors.append(f"SKILL.md front matter missing {field[:-1]}")


def validate_references(document: Path, errors: list[str]) -> None:
    """Confirm every relative reference link resolves inside the repository."""
    for link in REFERENCE_LINK.findall(document.read_text(encoding="utf-8")):
        if not (document.parent / link).is_file():
            errors.append(f"broken reference in {document}: {link}")


def main() -> int:
    """Validate the paths passed by the release check command."""
    if len(sys.argv) != 5:
        raise SystemExit("Usage: validate_skill.py SKILL.md README.md README.ko.md references/corpus-coverage.json")
    skill, english, korean, coverage = (Path(value) for value in sys.argv[1:])
    errors: list[str] = []
    for path in (skill, english, korean, coverage):
        if not path.is_file():
            errors.append(f"missing file: {path}")
    if not errors:
        validate_front_matter(skill, errors)
        for document in (skill, english, korean):
            validate_references(document, errors)
        manifest = json.loads(coverage.read_text(encoding="utf-8"))
        if manifest.get("schema_version") != 1 or not isinstance(manifest.get("files"), list):
            errors.append("corpus coverage manifest has an invalid schema")
    result = {"ok": not errors, "errors": errors}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
