# API And Codex Routes

## Direct OpenAI API

Use this when the user wants production code, deterministic model choice, or billing through an API key.

```python
from openai import OpenAI
import base64

client = OpenAI()

result = client.images.generate(
    model="gpt-image-2",
    prompt="A children's book illustration of a baby otter at a veterinarian.",
    size="1536x1024",
    quality="high",
)

image_bytes = base64.b64decode(result.data[0].b64_json)
with open("output.png", "wb") as f:
    f.write(image_bytes)
```

For edits/reference workflows, use the image edits endpoint with `model="gpt-image-2"` and one or more input images. Keep the prompt explicit about preserved details versus transformed details.

## Responses API image-generation tool

Use this when a Codex/agent workflow needs an image tool call through a reasoning model. Pick a current Responses model that supports the `image_generation` tool; the example below uses `gpt-5.5` because it appears in the current official guide.

```json
{
  "model": "gpt-5.5",
  "input": "Create a cinematic product poster...",
  "tools": [
    {
      "type": "image_generation",
      "size": "1536x1024",
      "quality": "high",
      "background": "auto"
    }
  ],
  "tool_choice": { "type": "image_generation" }
}
```

For streamed CLI wrappers, scan JSONL events for `response.output_item.done` where `item.type` is `image_generation_call`, then base64-decode `item.result`.

## Codex CLI / OAuth wrappers

Use this route only when the user specifically wants to use an existing local Codex login instead of an OpenAI API key. Reliability patterns from the linked repos:

- Check `codex` is installed and the login state is healthy before generation.
- Prefer `codex responses` with explicit `image_generation` payloads over free-form shell prompts when building plugins.
- Save stdout/stderr/event JSONL logs beside the output image for debugging.
- Snapshot output directories before running and accept only newly created or changed image files.
- Return absolute output paths and small JSON contracts for automation.
- Avoid hardcoding a machine-specific Codex binary path unless the user explicitly needs it.
- If inherited MCP config breaks subprocesses, consider launching with a clean MCP override in that wrapper only.
- Cache feature/capability checks briefly to avoid slowing every generation call.

## Output settings

- Drafts: `quality: "low"`, smaller valid sizes, quick iteration.
- Review: `quality: "medium"` with final aspect ratio.
- Final: `quality: "high"` and exact deliverable dimensions.
- Use `jpeg` or `webp` when latency/file size matters; use `png` for lossless review and assets with text.

## Verification

At minimum:

- Confirm file exists and is non-empty.
- Verify PNG/JPEG/WebP signature and dimensions.
- Compare the image against each prompt slot: required elements, layout, text, constraints, output.
- If a high-stakes result misses core instructions, retry once with a targeted correction rather than a longer generic prompt.
