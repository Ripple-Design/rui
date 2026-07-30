---
title: Menu API
routeSlug: menu
locale: en
docs: /en/components/menu/spec
designOrder: 146
developOrder: 146
---

## Import

```ts
import { RMenu, RMenuItem } from "@ripple-design/rui"
```

## Usage

```vue
<RMenu>
  <template #trigger>
    <RButton>More</RButton>
  </template>

  <RMenuItem @click="edit">Edit</RMenuItem>
</RMenu>
```

## Notes

- `RMenu` uses a single `trigger` slot.
- `RMenuItem` entries are action-only in v1 and emit `click`.
- `RMenu` accepts `align="start" | "end"` to align the menu with the trigger's inline-start or inline-end edge. This is logical alignment and follows RTL automatically.
