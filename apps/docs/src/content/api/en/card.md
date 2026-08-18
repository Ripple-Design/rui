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

| Name           | Type            | Default      | Required | Description                                                                   |
| -------------- | --------------- | ------------ | -------- | ----------------------------------------------------------------------------- |
| `variant`      | `RCardVariant`  | `"elevated"` | no       | Controls the card surface treatment.                                          |
| `color`        | `RSurfaceColor` | `"surface"`  | no       | Chooses the semantic card background color.                                   |
| `contentColor` | `string`        | —            | no       | Overrides the semantic foreground color inherited by card content.            |
| `clickable`    | `boolean`       | `false`      | no       | Enables ripple feedback for pointer and keyboard interaction.                 |
| `selectable`   | `boolean`       | `false`      | no       | Enables the controlled selected treatment.                                    |
| `selected`     | `boolean`       | `false`      | no       | Applies the controlled 8% foreground state layer when the card is selectable. |
| `activated`    | `boolean`       | `false`      | no       | Applies an independent 2px primary inner outline without a state layer.       |
| `dragged`      | `boolean`       | `false`      | no       | Applies the raised appearance while an owning drag interaction is active.     |

## CSS Variables

| Name                           | Default                   | Description                                       |
| ------------------------------ | ------------------------- | ------------------------------------------------- |
| `--rui-comp-card-hover-shadow` | `#{elevations.shadow(8)}` | Shadow used while the card is hovered or dragged. |

Generated from `../../../../../../packages/rui/src/components/layout/card/types.ts` and `../../../../../../packages/rui/src/components/layout/card/RCard.vue`.

<!-- AUTO-GENERATED:END -->
