---
title: Card
docSlug: components/card
tab: guidelines
locale: en
designOrder: 46
developOrder: 46
api: /en/api/card
---

## Usage

Use Card to group related content in a distinct elevated or outlined container.

### Keep state controlled

`clickable` enables ripple feedback. `selectable` enables the selected treatment, but Card does not update selection itself. The owning application supplies `selected`, `activated`, and `dragged` state.

`selected` adds an 8% state layer in the resolved content color. `activated` is independent: it adds a primary 2px inner outline and no state layer.

### Color treatment

Card forwards `color` and `contentColor` to Surface. The semantic surface color selects its matching default foreground; `contentColor` overrides that foreground and also controls the selected state layer and ripple color.

### Keep spacing external

Card has no default margin or padding. Use layout components for external spacing and child wrappers for content padding.
