# GPT Image 2 Codex Skill

A Codex skill for GPT Image 2 prompt design, image editing workflows, reverse-prompting style analysis, API usage notes, and Codex `image_generation` integration.

## Install

Clone this repository into your Codex skills directory:

```bash
git clone https://github.com/junyeo217/codex-gpt-image-2-skill.git ~/.codex/skills/gpt-image-2
```

Windows PowerShell:

```powershell
git clone https://github.com/junyeo217/codex-gpt-image-2-skill.git "$env:USERPROFILE\.codex\skills\gpt-image-2"
```

Restart Codex after installation so the skill metadata is reloaded.

## Usage

```text
Use $gpt-image-2 to create a cinematic Korean movie poster prompt.
```

```text
Use $gpt-image-2 to reverse-prompt this reference image into a reusable GPT Image 2 prompt.
```

```text
Use $gpt-image-2 to draft an API workflow for product-detail-page image generation.
```

## What It Covers

- Structured GPT Image 2 prompt framework
- Cinematic, portrait, product, ad, poster, UI, and infographic prompt patterns
- Reverse-prompting and style-analysis workflows
- Image editing and reference-image prompting
- API and Codex `image_generation` route notes
- Size validation and structured prompt helper script

## Helper Script

Compose a quick structured prompt:

```bash
python scripts/compose_prompt.py compose --brief "rainy Seoul cinematic poster with a red umbrella"
```

Validate a GPT Image 2 size:

```bash
python scripts/compose_prompt.py check-size --size 1536x1024
```

## Source Notes

This skill distills patterns from official OpenAI documentation, prompt-subtraction experiments, and public GPT Image 2 community workflows. It does not include the original PDF, Notion page content, or copied prompt collections.

## License

MIT
