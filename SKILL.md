---
name: gpt-image-2
description: Use when the user wants GPT Image 2 / GPT-Image-2.0 image generation, image editing, prompt design, reference-image workflows, Codex image_generation tooling, or production-ready visual prompts for posters, thumbnails, product shots, characters, book covers, ads, UI mockups, and cinematic images.
---

# GPT Image 2

Create or refine image prompts and image-generation workflows for `gpt-image-2`.

## First choice

- If the user asks to create or edit a bitmap image inside Codex, use the available image generation/editing tool directly.
- If the user asks for a reusable prompt, brief, workflow, API script, CLI wrapper, plugin, or project integration, produce or edit files using the patterns below.
- Do not claim the exact backend model used by a Codex UI/tool unless the runtime exposes it. For API work, explicitly set `model: "gpt-image-2"`.

## Prompt contract

Use the full slot stack from the prompt-subtraction PDF unless the user asks for something very quick:

```text
[Purpose]
[Core brief]
[Required elements]
[Context / environment]
[Style / rendering]
[Composition / framing]
[Light / material / color]
[Layout / spatial relationships]
[Text rules]
[Constraints / bans / fixed details]
[Output]
```

Keep slots short, concrete, and non-overlapping. The PDF experiments show quality collapses first when output, constraints, text rules, layout, lighting/material, or composition are removed; preserve those slots for commercial, cinematic, UI, and text-heavy work.

## Workflow

1. Identify the use case: portrait, cinematic still, poster, thumbnail, product shot, character concept, novel/book cover, ad banner, UI/mockup, infographic, or edit/reference workflow.
2. Convert vague requests into the slot stack. Ask at most one clarification only if the missing detail changes the medium or deliverable.
3. For text in the image, quote the exact text and specify placement, font style, surface integration, and "no extra text".
4. For realism, specify capture language: camera/film/lens, lighting source, material texture, depth of field, color palette, and practical constraints.
5. For edits, separate preserved identity/composition from the requested transformation.
6. Add negative constraints only for likely failure modes: watermark, logo, extra text, malformed hands, extra limbs, face drift, plastic skin, over-sharpening, layout drift.
7. Choose output settings deliberately: size/aspect, quality, format, background, and whether transparent output is required.
8. After generation, inspect the result against the prompt slots and iterate by correcting the missing slot, not by adding generic style words.

## API notes

- Official model: `gpt-image-2`; snapshot observed in docs: `gpt-image-2-2026-04-21`.
- Supported image endpoints: `/v1/images/generations` and `/v1/images/edits`.
- `gpt-image-2` accepts text and image input, outputs images, and automatically uses high-fidelity image inputs for edit/reference workflows.
- `background: "transparent"` is not supported by `gpt-image-2` in the official guide; use `opaque` or `auto`, or post-process transparency separately.
- Size can be flexible, but keep both edges multiples of 16, max edge <= 3840px, aspect ratio <= 3:1, and total pixels between 655,360 and 8,294,400.
- Use `quality: "low"` for drafts, `medium` for review assets, and `high` for finals.

Read as needed:

- `references/prompt-frameworks.md` for detailed prompt patterns.
- `references/api-and-codex-routes.md` for API, Codex CLI, OAuth-wrapper, and plugin implementation notes.
- `references/source-notes.md` for distilled notes from the PDF, Notion page, GitHub repos, and official docs.

## Helper script

Use `scripts/compose_prompt.py` to build a structured prompt or validate GPT Image 2 sizes:

```bash
python scripts/compose_prompt.py compose --brief "cinematic poster of a red umbrella in rainy Seoul"
python scripts/compose_prompt.py check-size --size 1536x1024
```
