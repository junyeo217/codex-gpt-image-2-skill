# Prompt Frameworks

## Slot stack

Use this complete stack for high-fidelity work:

1. `[Purpose]` - the deliverable and business/creative use.
2. `[Core brief]` - one sentence that would still make sense alone.
3. `[Required elements]` - objects, people, props, visible features.
4. `[Context / environment]` - time, place, era, world, situation.
5. `[Style / rendering]` - photo, editorial, film still, 3D, illustration, UI, product ad.
6. `[Composition / framing]` - crop, angle, subject position, camera distance, aspect.
7. `[Light / material / color]` - sources, reflections, texture, palette.
8. `[Layout / spatial relationships]` - foreground/background, negative space, text-safe zones.
9. `[Text rules]` - exact copy, placement, font, or "no text in image".
10. `[Constraints / bans / fixed details]` - no watermark, no logo, preserve identity, no extra people.
11. `[Output]` - aspect ratio, resolution intent, format, quality level.

## Subject + Context + Style

For fast drafts:

```text
[Subject] + [Context / environment] + [Style / medium]
```

Then add composition, lighting, text rules, constraints, and output before final generation.

## Photography / portrait

Use concrete capture language:

```text
[Camera/film/lens] + [lighting] + [texture] + [subject identity and face details] +
[wardrobe] + [pose/body placement] + [gaze/expression] + [background] +
[negative constraints] + [aspect/output]
```

Helpful realism constraints: `natural skin texture`, `subtle imperfections`, `no plastic skin`, `no airbrushing`, `no over-sharpening`, `no watermark`, `no extra text`.

## Cinematic image

Describe the result as a photographed still:

```text
35mm/16mm film still, lens and depth of field, motivated lighting,
specific subject action, exact environment, color palette, foreground/background layers,
film stock or grain, emotional tone, composition anchor.
```

Prefer "what the camera sees" over abstract adjectives. Replace "epic" with scale cues, lens, light, weather, silhouettes, and blocking.

## Text rendering

Text needs explicit rules:

- Put exact text in quotes.
- Specify position, hierarchy, and alignment.
- Specify font character: bold sans-serif, thin sans-serif, handwritten, serif, calligraphic, etc.
- For text on objects, add surface integration: text conforms to curvature/perspective and is not floating.
- Add `no extra text`, `no watermark`, and `no gibberish characters` when the text is important.

## Official Cookbook tuning rules

- Put prompts in a stable order and state the intended use: ad, UI mockup, infographic, catalog product shot, poster, or edit.
- Use labeled sections or short lines for complex production prompts instead of one overloaded paragraph.
- For photorealism, explicitly say `photorealistic` or real-photo language, then add natural texture and everyday imperfections.
- Use camera and lens terms as look/framing cues, not as exact physical guarantees.
- Start latency-sensitive or high-volume work at `quality: "low"`; move to `medium` or `high` for dense text, small labels, detailed infographics, close portraits, identity-sensitive edits, and final assets.
- For surgical edits, say `change only X` and `keep everything else the same`, then repeat the preserve list on follow-up iterations.
- For multi-image inputs, label each reference as `Image 1`, `Image 2`, etc. and say which image provides subject, style, setting, lighting, pose, or composition.
- Iterate with small single-change follow-ups instead of piling unrelated fixes into one long prompt.

## Product / ad

Make the product the anchor:

```text
product identity, surface/material, hero angle, lighting setup, shadows/reflections,
supporting props, whitespace for copy, brand-safe constraints, output size.
```

Avoid uncontrolled brand marks. If a real logo is required, confirm rights and keep the text/logo rule exact.

## Character concept

Use:

```text
character role, silhouette, costume layers, key props, pose, world context,
material palette, expression, camera/framing, constraints for anatomy and identity.
```

For consistency across multiple images, repeat identity anchors exactly and state which details must not change.

## Use-case playbook

Use these compact patterns when the user names a specific deliverable.

- **Infographic**: define the topic, audience, information hierarchy, labeled modules, arrows/flow, icon style, and reading order. Use higher quality for dense text or diagrams.
- **Translation in image**: preserve layout, icons, objects, composition, and style; change only the requested text language. State "do not change any other aspect."
- **Natural photoreal**: specify camera/lens, eye-level or candid framing, real skin/material texture, imperfect everyday details, natural color, and no heavy retouching.
- **World-knowledge scene**: specify exact place, era/date, clothing, staging, environment, and realism level. Avoid unsupported factual claims when accuracy matters.
- **Logo**: request original non-infringing marks, simple vector-like shapes, strong silhouette, balanced negative space, flat design, centered presentation, and no watermark.
- **Advertisement**: write a creative brief first: brand personality, audience, culture, product, tagline, composition, color direction, and exact text once.
- **Comic strip**: define panel count, panel order, recurring character consistency, action beat per panel, speech/text rules, and page orientation.
- **UI mockup**: specify device/surface, screen hierarchy, typography style, component density, interaction state, and whether text must be readable or placeholder.
- **Scientific / educational visual**: prioritize accurate labels, simplified structure, readable modules, callouts, arrows, scale cues, and no decorative clutter.
- **Slides, diagrams, charts**: define slide size, title hierarchy, chart type, legend, axis/labels, annotation style, and how much real text should appear.
- **Product shot / mockup**: isolate the product, keep shape accurate, state background, shadow/reflection behavior, edge cleanliness, and whether packaging/text must remain readable.

## Edit and reference workflows

- **Style transfer**: name the source image as the style reference and the new subject separately; preserve only style unless identity/layout should also remain.
- **Virtual try-on**: preserve face, identity, body shape, pose, skin tone, and camera angle; change only the garment/accessory.
- **Drawing to image**: preserve the drawing's composition and object relationships while upgrading material, lighting, realism, and environment.
- **Marketing creative with real text**: quote exact copy, place it once, define font style and integration, and forbid extra text or random letters.
- **Lighting/weather transformation**: keep subject, framing, and scene geometry; change only lighting, time of day, weather, mood, and reflections.
- **Object removal**: name the object to remove and describe how the background should be reconstructed; forbid artifacts, halos, duplicate objects, and smudges.
- **Person insertion**: specify the target scene, scale, perspective, contact shadows, lighting match, and which person identity must be preserved.
- **Multi-image compositing**: assign references as `Image 1`, `Image 2`, etc.; state which image provides subject, setting, style, lighting, and composition.
- **Interior design swap**: preserve room geometry and camera angle; change furniture, palette, materials, decor, and lighting as requested.
- **Collectible / plush / keychain**: specify product form, packaging or display base, materials, scale, cute/detail level, and centered catalog presentation.
- **Children's book art**: specify age range, emotional tone, medium, character consistency, safe composition, simple readable action, and warm color palette.

## Iteration by subtraction

When output drifts, locate the missing slot:

- Wrong crop: repair `[Composition / framing]` and `[Output]`.
- Missing object: repair `[Required elements]`.
- Bad text: repair `[Text rules]`.
- Layout chaos: repair `[Layout / spatial relationships]`.
- Wrong mood: repair `[Light / material / color]` and `[Context]`.
- Generic AI look: repair `[Style / rendering]` with capture details and add anti-slop constraints.
