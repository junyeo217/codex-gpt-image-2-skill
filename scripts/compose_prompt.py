#!/usr/bin/env python3
"""Compose structured GPT Image 2 prompts and validate image sizes."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


SLOTS = [
    ("purpose", "Purpose"),
    ("brief", "Core brief"),
    ("required", "Required elements"),
    ("context", "Context / environment"),
    ("style", "Style / rendering"),
    ("composition", "Composition / framing"),
    ("lighting", "Light / material / color"),
    ("layout", "Layout / spatial relationships"),
    ("text", "Text rules"),
    ("constraints", "Constraints / bans / fixed details"),
    ("output", "Output"),
]


def load_data(args: argparse.Namespace) -> dict[str, str]:
    data: dict[str, str] = {}
    if args.json:
        raw = Path(args.json).read_text(encoding="utf-8")
        obj = json.loads(raw)
        if not isinstance(obj, dict):
            raise SystemExit("--json must point to a JSON object")
        data.update({str(k): "" if v is None else str(v) for k, v in obj.items()})
    if args.brief:
        data.setdefault("brief", args.brief)
    return data


def compose(args: argparse.Namespace) -> int:
    data = load_data(args)
    default_constraints = "no watermark, no unwanted logo, no extra text unless requested"
    if args.no_default_constraints:
        default_constraints = ""

    lines: list[str] = []
    for key, label in SLOTS:
        value = data.get(key, "").strip()
        if key == "constraints" and not value:
            value = default_constraints
        if key == "output" and not value and args.output:
            value = args.output
        if value:
            lines.append(f"[{label}] {value}")

    if not lines:
        raise SystemExit("Provide --brief or --json with at least one slot")

    print("\n".join(lines))
    return 0


def parse_size(size: str) -> tuple[int, int]:
    match = re.fullmatch(r"(\d+)x(\d+)", size.strip().lower())
    if not match:
        raise SystemExit("Size must look like WIDTHxHEIGHT, e.g. 1536x1024")
    return int(match.group(1)), int(match.group(2))


def check_size(args: argparse.Namespace) -> int:
    width, height = parse_size(args.size)
    pixels = width * height
    long_edge = max(width, height)
    short_edge = min(width, height)
    checks = {
        "both_edges_multiple_of_16": width % 16 == 0 and height % 16 == 0,
        "max_edge_lt_3840": long_edge < 3840,
        "aspect_ratio_lte_3_to_1": long_edge / short_edge <= 3,
        "pixels_in_range": 655_360 <= pixels <= 8_294_400,
        "within_2k_reliability_boundary": pixels <= 3_686_400,
    }
    ok = all(
        checks[key]
        for key in (
            "both_edges_multiple_of_16",
            "max_edge_lt_3840",
            "aspect_ratio_lte_3_to_1",
            "pixels_in_range",
        )
    )
    warnings = []
    if long_edge >= 3840:
        warnings.append(
            "Official guidance says the maximum edge must be less than 3840px; "
            "round UHD targets down, e.g. 3824x2144."
        )
    if pixels > 3_686_400:
        warnings.append(
            "Above 2560x1440 / 2K, official guidance treats output as experimental and more variable."
        )
    print(json.dumps({
        "ok": ok,
        "size": f"{width}x{height}",
        "pixels": pixels,
        "checks": checks,
        "warnings": warnings,
    }, indent=2))
    return 0 if ok else 1


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    p_compose = sub.add_parser("compose", help="compose a structured prompt")
    p_compose.add_argument("--brief", help="core brief")
    p_compose.add_argument("--json", help="JSON file containing slot keys")
    p_compose.add_argument("--output", default="high-resolution image", help="default output slot")
    p_compose.add_argument("--no-default-constraints", action="store_true")
    p_compose.set_defaults(func=compose)

    p_size = sub.add_parser("check-size", help="validate a GPT Image 2 size")
    p_size.add_argument("--size", required=True)
    p_size.set_defaults(func=check_size)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
