---
title: Banner API
routeSlug: banner
locale: en
docs: /en/components/banner/spec
designOrder: 128
developOrder: 128
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RBanner } from "@ripple-design/rui"
```

## Props

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | no | Controls whether the banner is shown in its parent flow. |
| `message` | `string` | yes | Sets the persistent message displayed by the banner. |
| `lines` | `1 \| 2 \| 3` | no | Sets the message line count, reserves that height, and truncates overflowing text. |
| `icon` | `RIconResolvableSource` | no | Renders an optional decorative leading icon. |
| `leftAction` | `string` | no | Sets the optional left action label. |
| `rightAction` | `string` | no | Sets the optional right action label. |

Generated from `packages/rui/src/components/banner/types.ts`.

<!-- AUTO-GENERATED:END -->
