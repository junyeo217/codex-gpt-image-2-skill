# Corpus Router

> ⚠️ **LOCAL-ONLY**: 이 파일이 가리키는 디렉토리들은 특정 로컬 머신에만 존재한다. 이 문서는 스킬 동작에 불필요하며, 원본 코퍼스를 다시 증류(re-distill)할 때만 참고한다. 실제 요청 라우팅은 `SKILL.md`가 담당하며, 이 파일과 `corpus-coverage.json`은 `references/` 최상위 라우팅 대상이 아니다.

This repository is upgraded from the complete local prompt corpus recorded in
[`corpus-coverage.json`](./corpus-coverage.json). The manifest is deliberately
source-preserving: it records every file's relative path, size, line count,
structured-record count where applicable, and SHA-256 without republishing the
200 MB source collection. `corpus-coverage.json` is machine-generated locally by
`tools/build_corpus_coverage.py` and is intentionally not committed (it is
gitignored); `tools/validate_skill.py` treats it as optional and skips the
coverage check when it is absent.

## Select the right corpus family

| Request | Load this local source family | Apply it as |
|---|---|---|
| Fast, broad ideation across commercial and social formats | `prompts3_카테고리별_프롬프트_원문/` | A diversity pool. Choose one clear visual direction, then rebuild it in the slot stack rather than pasting a long raw prompt. |
| Fashion, beauty, Korean posters, product catalogs, campaigns, infographics, card news, branding, 3D icons, or comics | `prompt-library-2026/` | A Korean deliverable-specific reference. Preserve Korean copy exactly and state text hierarchy plus a no-extra-text rule. |
| Poster/flyer, game asset, infographic, comic/storyboard, e-commerce image, app/web, thumbnail, or miscellaneous visual | `ai-image-prompts-skill-main/references/` | A large JSON example set. Use `content` as an input record and retain `needReferenceImages` as a requirement, not as decoration. |
| Typography posters, campaign key art, diagrams, dense slides, 21:9 decks, or validated production prompts | `gongnyang-prompt-kit/` | A layout-first router. Reuse `full_prompt`, palette, aspect, output fields, Korean copy, and QA fields through `compose-record` and `validate-record`. |
| Provider workflow, evaluation strategy, or production handoff | `generative-media-skills-main/` | Provider-neutral process lessons only. Keep GPT Image 2 settings and capabilities authoritative to this skill; do not copy another provider's parameters. |
| Iterative image generation or edit direction | `maestro-main/` | Separate preservation requirements, a single requested change, and the evaluation pass. |
| Image briefs, asset manifests, and delivery QA | `reelforge-main/` | Turn a creative brief into named assets with output path, status, and acceptance checks. |
| GPT Image 2 / cinematic operating guidance | `guides/`, `openmontage-main/`, and `codex-gpt-image-2/` | Use the existing API/Codex route guidance, the slot stack, and the photographic reference files already in this repository. |
| Curated prompt/settings examples | `prom-gallery/` | Treat original prompts and settings as examples; extract reusable visual structure rather than copying identifiers or claims. |

## Structured-record workflow

The router supports both corpus record shapes:

- JSONL layout records: `id`, `full_prompt`, `category`, `palette`, `ar`,
  `size`, `quality`, `output_format`, `korean_copy`, and optional `qa`.
- JSON arrays: `id`, `title`, `description`, `content`, and
  `needReferenceImages`.

Use the helper against a local corpus copy:

```bash
python scripts/compose_prompt.py compose-record \
  --input /path/to/gongnyang-prompt-kit/examples/prompts.sample.jsonl \
  --id C3-EVENT-001

python scripts/compose_prompt.py validate-record \
  --input /path/to/gongnyang-prompt-kit/examples/prompts.sample.jsonl \
  --id C3-EVENT-001
```

For an example from a JSON category dataset, supply its numeric `id` to the
same commands. `compose-record` emits the source and record ID before the
prompt; preserve that provenance during review.

## Synthesis rules

1. Select one family for the deliverable and at most one secondary family for a
   missing capability such as typography, diagrams, or asset QA.
2. Convert examples to the current master templates (8-slot cinematic / 6-section)
   defined in SKILL.md. Do not merge several unrelated long prompts or
   cross-provider parameters.
3. When text, panels, diagrams, or a dense layout matters, lock reading order,
   hierarchy, text-safe zones, exact copy, and the no-extra-text constraint.
4. When a record supplies a palette, aspect, quality, output format, or QA
   fields, keep them explicit in the final prompt and use them as acceptance
   criteria.
5. When a record says it needs reference images, label each input image by its
   job: identity, pose, product shape, scene, style, lighting, or composition.
6. For edits, use the same source only for the requested transformation; state
   the preserve list separately so source example detail cannot cause drift.

## Maintenance

When the local corpus changes, regenerate and verify the coverage artifact:

```bash
python tools/build_corpus_coverage.py --corpus /path/to/data --output references/local/corpus-coverage.json
python tools/validate_corpus_coverage.py --corpus /path/to/data --coverage references/local/corpus-coverage.json
```
