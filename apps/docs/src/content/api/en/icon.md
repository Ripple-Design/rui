---
title: Icon API
routeSlug: icon
locale: en
docs: /en/components/icon/spec
designOrder: 130
developOrder: 50
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RIcon } from "@ripple-design/rui"
```

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `icon` | `RIconResolvableSource` | — | no | Optimized icon source, a themed icon family, or a Vue component to render. |
| `iconStyle` | `RIconStyle` | — | no | Overrides the active themed icon style when resolving an icon family. |
| `size` | `string \| number` | — | no | Controls the icon size. Numbers map to pixels, while strings pass through directly. |
| `emphasis` | `RIconEmphasis` | `"medium"` | no | Controls the icon foreground emphasis level, or inherits the surrounding foreground. |
| `decorative` | `boolean` | — | no | Forces the icon to be decorative and hidden from assistive technology. |
| `label` | `string` | — | no | Sets the accessible name announced for a non-decorative icon. |

Generated from `packages/rui/src/components/icon/types.ts`.

<!-- AUTO-GENERATED:END -->
