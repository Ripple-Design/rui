---
title: Menu
docSlug: components/menu
tab: guidelines
locale: en
designOrder: 146
developOrder: 146
api: /en/api/menu
---

## Usage guidance

Use `RMenu` for short action lists anchored to a trigger control.

- Prefer concise, verb-led labels for action items.
- Use `RMenuGroup v-model` for a mutually exclusive set of choices. `indicator="overlay"` uses an 8% state layer, while `indicator="check"` shows a leading check and preserves a 24px empty leading slot for unselected items.
- Use separate groups for independent choice sets; each group owns its own selected value.
- Use tooltip or popover when you only need one hint or freeform content rather than an action list.
