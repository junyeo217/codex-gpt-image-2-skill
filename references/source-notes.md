# Source Notes

These are distilled notes from official documentation, the OpenAI Cookbook image generation prompting guide, user-provided prompt experiments, public community workflows, and the Soylab GPT Image 2 web guide captured as a PDF. They are not a full copy of the sources.

## Official docs checked on 2026-04-26

- `gpt-image-2` is documented as OpenAI's state-of-the-art image generation/editing model.
- It supports text and image input and image output.
- It supports image generation and image edit endpoints.
- The docs list `gpt-image-2-2026-04-21` as a snapshot.
- The image guide notes organization verification may be required for GPT Image models.
- The guide says `gpt-image-2` does not currently support transparent backgrounds.
- Official Cookbook size constraints: max edge < 3840px, both edges multiples of 16, long:short <= 3:1, total pixels 655,360 to 8,294,400.
- The Cookbook treats 2K/QHD (`2560x1440`) as a recommended upper reliability boundary and warns that larger outputs can be more variable.
- The Cookbook model summary says `input_fidelity` is disabled for `gpt-image-2` because image inputs are already high fidelity by default.
- The Cookbook recommends `gpt-image-2` as the default for new production image builds, especially text-heavy, photorealistic, compositing, and identity-sensitive workflows.

## Prompt guides

The reviewed prompt guides included GPT Image 2 web and document references. Important takeaways:

- Treat images as structured visual language, not decoration.
- Use a simple `Subject + Context + Style` draft framework, then expand into production slots.
- For photography, specify camera/film/lens, lighting, film texture, subject details, wardrobe, pose, expression, background, negative constraints, and aspect ratio.
- For text rendering, quote the exact text, specify font style, placement, and surface integration.
- For cinematic images, describe a real shot: film still, lens, motivated lighting, depth of field, film stock, blocking, and color palette.
- For official Cookbook-style prompts, use a stable structure, labeled sections for complex tasks, explicit purpose, exact preservation/change rules for edits, and small targeted follow-up iterations.
- Use case patterns worth preserving include infographics, translation inside images, natural photoreal scenes, world-knowledge scenes, original logos, ads, comic strips, UI mockups, scientific/educational visuals, slides, diagrams, charts, style transfer, virtual try-on, drawing-to-image, product mockups, real-text marketing creatives, lighting/weather edits, object removal, person insertion, multi-image compositing, interior swaps, collectibles, and children's book art.

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

## Community workflow notes

Several public GPT Image 2 and Codex image-generation community workflows were reviewed for general patterns. No source code, full prompt collections, or original assets from those projects are included in this skill.

Useful generalized patterns:

- Keep prompt construction structured instead of relying on generic style adjectives.
- Preserve identity, layout, and requested edits as separate instruction groups.
- Validate generated files before using them downstream.
- Return stable output paths and simple machine-readable results when building automation wrappers.
- Keep debug logs for failed generations or extraction failures.
- Avoid machine-specific binary paths, local account assumptions, or claims about exact backend model identity unless the runtime proves them.
- Reuse community prompt patterns as design inspiration, not as copied prompt collections.
