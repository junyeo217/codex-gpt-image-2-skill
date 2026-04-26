# GPT Image 2 Codex Skill

[한국어 문서](README.ko.md) | English

A Codex skill for GPT Image 2 prompt design, reverse prompting, image editing guidance, and production-ready visual brief construction.

This repository is a **Codex skill**, not an image model, not an API wrapper, and not a standalone image-generation service. It gives Codex a compact workflow for turning vague visual ideas, reference images, or production requirements into structured GPT Image 2 prompts and practical creative direction.

## What This Skill Is For

Use this skill when you want Codex to help with:

- Production-ready GPT Image 2 prompts and visual briefs
- Reverse prompting from a reference image into a reusable reproduction prompt
- Image editing instructions that separate preserved details from requested changes
- Cinematic posters, portraits, product shots, ads, thumbnails, UI mockups, infographics, detail-page visuals, logos, comics, diagrams, charts, slides, and character concepts
- Specialized image workflows such as translation inside images, virtual try-on, drawing-to-image, product mockups, object removal, person insertion, lighting/weather changes, and multi-image compositing
- Prompt QA, failure diagnosis, and targeted iteration
- Visual brief cleanup before generating images in Codex, ChatGPT, or another GPT Image 2 workflow

## Core Idea

The skill uses a structured prompt stack inspired by prompt-subtraction testing. Instead of relying on generic style words, it breaks image prompts into controllable visual slots:

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

This structure is especially useful for layout-sensitive work such as posters, thumbnails, e-commerce detail pages, product ads, infographics, educational visuals, UI mockups, and images with rendered text.

## Install

Clone this repository into your Codex skills directory.

macOS / Linux:

```bash
git clone https://github.com/junyeo217/codex-gpt-image-2-skill.git ~/.codex/skills/gpt-image-2
```

Windows PowerShell:

```powershell
git clone https://github.com/junyeo217/codex-gpt-image-2-skill.git "$env:USERPROFILE\.codex\skills\gpt-image-2"
```

Restart Codex after installation so the skill metadata is reloaded.

## Usage Examples

Create a cinematic poster prompt:

```text
Use $gpt-image-2 to create a Korean noir movie poster prompt set in rainy Seoul.
```

Reverse-prompt a reference image:

```text
Use $gpt-image-2 to analyze this reference image and turn it into a reusable GPT Image 2 prompt.
```

Design a product-detail-page visual:

```text
Use $gpt-image-2 to create a full cosmetic product detail page image prompt, not just a hero image.
```

Create a structured infographic prompt:

```text
Use $gpt-image-2 to create an infographic prompt explaining the 5 steps of a skincare routine for first-time customers.
```

Diagnose a weak prompt:

```text
Use $gpt-image-2 to improve this prompt and explain which visual slots are missing.
```

## Reverse Prompting Workflow

For reference-image analysis, the skill does not try to recover the original hidden prompt. Instead, it creates a practical reproduction prompt by analyzing visible traits:

- Subject and required objects
- Environment and context
- Camera angle, crop, and composition
- Lighting, color palette, materials, and texture
- Layout and spatial relationships
- Text rules, if text appears in the image
- Constraints that prevent common failures
- Output format and aspect ratio

A good request looks like this:

```text
Use $gpt-image-2 to reverse-prompt this image into:
1. observed visual breakdown
2. GPT Image 2 reproduction prompt
3. three variation prompts
4. failure-prevention constraints
```

## Image Editing Workflow

For image edits, the skill separates:

- Details that must be preserved, such as identity, pose, product shape, layout, camera angle, or room geometry
- Details that should change, such as background, clothing, color palette, style, object placement, weather, lighting, or text
- Constraints that prevent unwanted drift, such as face changes, broken hands, extra logos, text corruption, halos, smudges, or layout collapse

This helps Codex produce edit instructions that are less ambiguous and easier to verify.

## Advanced Implementation Notes

This skill is primarily for prompt and visual-direction work. It also includes a small reference file for advanced users who want to connect the prompt workflow to implementation routes such as:

- Direct Image API calls with `model="gpt-image-2"`
- Responses API / Codex workflows using the `image_generation` tool

These notes are supplementary, not the main purpose of the skill. See [references/api-and-codex-routes.md](references/api-and-codex-routes.md) if you need them.

## Helper Script

The repository includes a small helper script for composing slot-based prompts and validating GPT Image 2 image sizes.

Compose a quick structured prompt:

```bash
python scripts/compose_prompt.py compose --brief "rainy Seoul cinematic poster with a red umbrella"
```

Validate a size:

```bash
python scripts/compose_prompt.py check-size --size 1536x1024
```

## Repository Structure

```text
.
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── api-and-codex-routes.md
│   ├── prompt-frameworks.md
│   └── source-notes.md
├── scripts/
│   └── compose_prompt.py
├── README.md
├── README.ko.md
└── LICENSE
```

## Notes And Limitations

- This skill does not prove which backend image model a Codex UI tool uses unless the runtime exposes that information.
- For deterministic API work, explicitly set `model="gpt-image-2"`; API notes are provided only as supplementary reference.
- Reverse prompting creates a useful reproduction prompt, not the exact original prompt.
- The repository does not include the original PDF, Notion page text, Soylab page content, or copied prompt collections.
- Always follow OpenAI usage policies and applicable rights when using real people, brands, logos, or copyrighted references.

## Sources

This skill distills patterns from official OpenAI documentation, user-provided prompt-subtraction experiments, the Soylab GPT Image 2 guide, and public GPT Image 2 community workflows. Source notes are summarized in [references/source-notes.md](references/source-notes.md).

## License

MIT
