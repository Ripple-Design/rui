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

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | — | no | Controls whether the banner is shown in its parent flow. |
| `message` | `string` | — | yes | Sets the persistent message displayed by the banner. |
| `lines` | `1 \| 2 \| 3` | `1` | no | Sets the message line count, reserves that height, and truncates overflowing text. |
| `icon` | `RIconResolvableSource` | — | no | Renders an optional decorative leading icon. |
| `leftAction` | `string` | `""` | no | Sets the optional left action label. |
| `rightAction` | `string` | `""` | no | Sets the optional right action label. |

## Events

| Name | Parameters | Description |
| --- | --- | --- |
| `update:modelValue` | `value: boolean` | — |
| `left-action` | `value: MouseEvent` | — |
| `right-action` | `value: MouseEvent` | — |
| `shown` | — | — |
| `dismissed` | — | — |

## CSS Variables

| Name | Default | Description |
| --- | --- | --- |
| `--rui-comp-banner-background` | `var(--rui-sys-color-surface)` | Banner surface background color. |
| `--rui-comp-banner-message-color` | `var(--rui-sys-color-on-surface-high)` | Banner message text color. |
| `--rui-comp-banner-action-color` | `var(--rui-sys-color-primary)` | Banner action text color. |
| `--rui-comp-banner-divider-color` | `var(--rui-sys-color-on-surface)` | Banner divider color. |

Generated from `packages/rui/src/components/banner/types.ts` and `packages/rui/src/components/banner/RBanner.vue`.

<!-- AUTO-GENERATED:END -->
