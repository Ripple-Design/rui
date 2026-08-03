---
title: Card API
routeSlug: card
locale: en
docs: /en/components/card/spec
designOrder: 126
developOrder: 46
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RCard } from "@ripple-design/rui"
```

## Props

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `variant` | `RCardVariant` | no | Controls the card surface treatment. |
| `color` | `RSurfaceColor` | no | Chooses the semantic card background color. |
| `contentColor` | `string` | no | Overrides the semantic foreground color inherited by card content. |
| `clickable` | `boolean` | no | Enables ripple feedback for pointer and keyboard interaction. |
| `selectable` | `boolean` | no | Enables the controlled selected treatment. |
| `selected` | `boolean` | no | Applies the controlled 8% foreground state layer when the card is selectable. |
| `activated` | `boolean` | no | Applies an independent 2px primary inner outline without a state layer. |
| `dragged` | `boolean` | no | Applies the raised appearance while an owning drag interaction is active. |

Generated from `packages/rui/src/components/card/types.ts`.

<!-- AUTO-GENERATED:END -->
