# Source Notes

These are distilled implementation notes from the user-provided PDF and links. They are not a full copy of the sources.

## Official docs checked on 2026-04-26

- `gpt-image-2` is documented as OpenAI's state-of-the-art image generation/editing model.
- It supports text and image input and image output.
- It supports image generation and image edit endpoints.
- The docs list `gpt-image-2-2026-04-21` as a snapshot.
- The image guide notes organization verification may be required for GPT Image models.
- The guide says `gpt-image-2` does not currently support transparent backgrounds.
- Flexible size constraints: max edge <= 3840px, both edges multiples of 16, long:short <= 3:1, total pixels 655,360 to 8,294,400.

## Notion guide

The public Notion page title was `GPT-Image-2 활용 가이드`. Important takeaways:

- Treat images as structured visual language, not decoration.
- Use a simple `Subject + Context + Style` draft framework, then expand into production slots.
- For photography, specify camera/film/lens, lighting, film texture, subject details, wardrobe, pose, expression, background, negative constraints, and aspect ratio.
- For text rendering, quote the exact text, specify font style, placement, and surface integration.
- For cinematic images, describe a real shot: film still, lens, motivated lighting, depth of field, film stock, blocking, and color palette.

## PDF: Prompt Subtractions

The PDF contains 60 variants across 6 templates and 10 subtraction stages. Its practical lesson:

- A complete prompt should include purpose, core brief, required elements, context, style, composition, light/material/color, layout, text rules, constraints, and output.
- Removing output, constraints, text rules, layout, lighting/material, or composition makes results less controllable even when the core brief remains.
- Use the complete stack for cinematic posters, YouTube thumbnails, product shots, character concept art, novel covers, and ad banners.

Template families observed:

- Cinematic poster
- YouTube thumbnail
- Product shot
- Character concept
- Novel/book cover
- Ad banner

## GitHub implementation repos

`ktkarchive/codex-imagegen-2-skill-for-kimi`:

- Useful patterns: prompt enhancement, generation/edit scripts, PNG validation, optional prompt-image alignment scoring, history logging.
- Be careful with claims about free billing or exact backend identity unless the local runtime proves it.

`jkf87/openclaw-codex-image-gen`:

- Useful patterns: direct `codex responses` payload, `image_generation` tool choice, JSONL event extraction, output path JSON, logs, aspect mapping, retry handling.
- Avoid copying machine-specific binary paths into reusable skills.

`techkwon/hermes-codex-image-skill`:

- Useful patterns: stable output copy, JSON contract, login checks, explicit caveat that local Codex behavior does not prove exact backend model identity.

`Jinbro98/hermes-gpt-image-gen`:

- Useful patterns: tool registration, explicit output path returns, feature checks, new/changed output-file detection, debug artifacts, temp cleanup.

`EvoLinkAI/awesome-gpt-image-2-prompts`:

- Useful prompt families: portraits, posters/illustrations, character design, UI/mockups, comparison/edit cases, high-density infographics.
- Reuse patterns, not copyrighted prompt collections wholesale.
