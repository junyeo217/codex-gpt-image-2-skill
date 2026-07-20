# GPT Image 2 Prompt Skill

[한국어 문서](README.ko.md) | English

A general-purpose Codex/Claude Code skill for designing `gpt-image-2` prompts — drama stills, music-video key art, commercial and product ads, editorial fashion/beauty shoots, posters and typography, character sheets, multi-shot storyboards, image edits, and reverse prompting from a reference image.

This repository is a **prompt-design skill**, not an image model, not an API wrapper, and not a standalone generation service. It gives an agent a compact, layered reference set so it loads only what a given request needs instead of one giant document.

## What This Skill Is For

- Production-ready `gpt-image-2` prompts across drama, music video, commercial/product, and editorial fashion domains
- Character/identity consistency across multiple shots (sheets, hero-reference workflow, drift recovery)
- Cinematic single stills (mise-en-scène, 8-slot tag taxonomy, film-stock grading)
- Multi-shot sequences and storyboards, including Image-to-Video handoff considerations
- Reference-image edit workflows (person swap, style transfer, virtual try-on, relight, object add/remove)
- Exact text-in-image rendering, including Korean-specific typography failure modes
- Reverse prompting a reference image into a reusable reproduction prompt
- Model facts, pricing, and API/Codex implementation routes when explicitly needed

## Architecture

Progressive disclosure: one core-grammar file always applies, everything else is loaded on demand through the routing table in `SKILL.md`.

```text
SKILL.md                        entry point — routing table, tenet summary, master template, output contract
references/
├── core-grammar.md             always-on law: tenets, tiered negatives, dead-word removal,
│                                numeric anchoring, size lock, self-check checklist
├── character-consistency.md    identity lock, character sheets, hero-reference workflow
├── cinematic-stills.md         mise-en-scène, 8-slot cinematic tag taxonomy, film stocks
├── multi-shot.md               storyboard strategy, frame variation, I2V handoff
├── edit-workflows.md           change-only-X, preserve lock-lists, edit recipes
├── text-in-image.md            Tier-1 text guard, zone/band grammar, Hangul rules
├── model-facts.md              capabilities, hard constraints, pricing, model choice
├── api-and-codex-routes.md     Images API, Responses tool, Codex CLI call code
├── lanes/                      thin domain presets (compose core files, add defaults)
│   ├── drama.md
│   ├── music-video.md
│   ├── commercial.md
│   └── editorial.md
├── photo-prompt-master/        granular photography vocabulary (camera, light, color, genre...)
├── validated-examples/         8 worked, checked prompt examples + README
└── local/                      machine-local corpus router — not part of skill routing
scripts/
└── compose_prompt.py           slot-based prompt composer, size validator
tools/
├── check_prompt.mjs            automated core-grammar checklist validator (if present)
├── build_corpus_coverage.py    local-only corpus manifest builder
├── validate_corpus_coverage.py local-only corpus manifest verifier
└── validate_skill.py           front-matter and reference-link validator
```

## Install

Clone into your Codex skills directory:

```bash
git clone https://github.com/junyeo217/codex-gpt-image-2-skill.git ~/.codex/skills/gpt-image-2
```

For Claude Code, symlink (or clone) the same repository into your project's `.claude/skills/` directory so it is discoverable alongside other skills:

```bash
mkdir -p .claude/skills
ln -s ~/.codex/skills/gpt-image-2 .claude/skills/gpt-image-2
```

Restart the agent session after installation so the skill metadata reloads.

## Usage Flow

1. Match the request against the routing table in `SKILL.md` — one row, one primary reference.
2. `core-grammar.md` always applies; it is not itself a routing target.
3. Load 1-2 files total. Do not read all eight core references for one request.
4. Compose the prompt using the matched reference's vocabulary on top of core-grammar's rules.
5. Run the 9-point self-check in `core-grammar.md` before returning the prompt.
6. Validate mechanically with `node tools/check_prompt.mjs <file>` if the tool is present.

Routing table summary (full table lives in `SKILL.md`):

| Signal | Reference |
|---|---|
| character consistency, character sheet | `character-consistency.md` |
| cinematic/film still | `cinematic-stills.md` |
| storyboard, multi-shot, I2V | `multi-shot.md` |
| edit, change-only-X, preserve | `edit-workflows.md` |
| poster copy, headline, typography | `text-in-image.md` |
| drama / music video / commercial / editorial | `lanes/*.md` |
| API, pricing, model choice | `model-facts.md` + `api-and-codex-routes.md` |
| need a checked example | `validated-examples/` |

## Validated Examples

`references/validated-examples/` holds eight worked prompts that passed the core-grammar self-check, each with the request, the composed prompt, and the reasoning behind key choices. Read its own README before copying a pattern — examples are references, not templates to paste verbatim.

## Prompt Validation

If `tools/check_prompt.mjs` is present, run it against a drafted prompt file to check the mechanical parts of the self-check (negative-sentence count, HEX palette presence, size whitelist membership, Tier-1 guard placement):

```bash
node tools/check_prompt.mjs path/to/prompt.txt
```

## Helper Script

The primary validation tool is `tools/check_prompt.mjs` (see Prompt Validation above) — always run a drafted prompt through it before use:

```bash
node tools/check_prompt.mjs path/to/prompt.txt
```

`scripts/compose_prompt.py compose` is a legacy drafting scaffold only; its labeled-slot output must be rewritten into core-grammar-compliant prose and validated with `check_prompt.mjs` before use.

## Sources And Credit

This skill's methodology — concept-variable axes for dead-word reduction, the R-axis body-reaction translation technique, tiered positive-only negatives, and the layout-first routing pattern — draws inspiration from the `gongnyang-prompt-kit` reference approach, plus general community GPT Image 2 workflows and official OpenAI documentation. No original prompt collections, PDFs, or third-party repository contents are copied into this repository; only distilled patterns and structure are retained. Specific local file paths are intentionally excluded — see `references/local/` for the machine-local corpus router, which is not required for the skill to function.

## License

MIT
