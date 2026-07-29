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
