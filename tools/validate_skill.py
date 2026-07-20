#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
# ─── How to run ───
# uv run tools/validate_skill.py SKILL.md README.md README.ko.md [references/local/corpus-coverage.json]
#
# The coverage manifest argument is OPTIONAL. It is a machine-generated, local-only
# artifact (see tools/build_corpus_coverage.py) that is gitignored and will not exist
# on a clean checkout. When it is omitted, or the given path does not exist, the
# coverage check is skipped (not an error) and reported as "coverage": "skipped ...".
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
    # NOTE: only checks markdown-link syntax ](references/...); backtick-quoted paths are not covered.
    for link in REFERENCE_LINK.findall(document.read_text(encoding="utf-8")):
        if not (document.parent / link).is_file():
            errors.append(f"broken reference in {document}: {link}")


def main() -> int:
    """Validate the paths passed by the release check command."""
    if len(sys.argv) not in (4, 5):
        raise SystemExit(
            "Usage: validate_skill.py SKILL.md README.md README.ko.md "
            "[references/local/corpus-coverage.json]"
        )
    skill, english, korean = (Path(value) for value in sys.argv[1:4])
    coverage = Path(sys.argv[4]) if len(sys.argv) == 5 else None

    errors: list[str] = []
    for path in (skill, english, korean):
        if not path.is_file():
            errors.append(f"missing file: {path}")

    if not errors:
        validate_front_matter(skill, errors)
        for document in (skill, english, korean):
            validate_references(document, errors)

    if coverage is not None and coverage.is_file():
        try:
            manifest = json.loads(coverage.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"corpus coverage manifest is not valid JSON: {exc}")
            coverage_status = "invalid"
        else:
            if not isinstance(manifest, dict):
                # A valid JSON document whose top level isn't an object (e.g. `[]` or `null`)
                # would otherwise crash on manifest.get() below. Report it structurally instead.
                errors.append("corpus coverage manifest must be a JSON object at the top level")
                coverage_status = "invalid (top-level must be an object)"
            elif manifest.get("schema_version") != 1 or not isinstance(manifest.get("files"), list):
                errors.append("corpus coverage manifest has an invalid schema")
                coverage_status = "invalid"
            else:
                coverage_status = "checked"
    else:
        coverage_status = (
            "skipped (local-only manifest not present; generate with tools/build_corpus_coverage.py)"
        )

    result = {"ok": not errors, "errors": errors, "coverage": coverage_status}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
