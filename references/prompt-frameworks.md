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

## Iteration by subtraction

When output drifts, locate the missing slot:

- Wrong crop: repair `[Composition / framing]` and `[Output]`.
- Missing object: repair `[Required elements]`.
- Bad text: repair `[Text rules]`.
- Layout chaos: repair `[Layout / spatial relationships]`.
- Wrong mood: repair `[Light / material / color]` and `[Context]`.
- Generic AI look: repair `[Style / rendering]` with capture details and add anti-slop constraints.
