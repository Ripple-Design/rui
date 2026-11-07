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
import { RMenu, RMenuGroup, RMenuItem } from "@ripple-design/rui"
```

## Usage

```vue
<RMenu>
  <template #trigger>
    <RButton>More</RButton>
  </template>

  <RMenuGroup v-model="sort">
    <RMenuItem value="recent">Most recent</RMenuItem>
    <RMenuItem value="popular">Most popular</RMenuItem>
  </RMenuGroup>
</RMenu>
```

## Notes

- `RMenu` uses a single `trigger` slot.
- `RMenuItem` entries emit `click` when activated.
- `RMenuGroup` owns a controlled single selected value through `v-model`; items with `value` become `menuitemradio` choices and expose `aria-checked`. `indicator="overlay" | "check"` chooses the selected treatment.
- Groups have 8px block padding and are separated by full-width dividers. Iconless overlay selections use an 8% state layer; `indicator="check"` replaces the selected item’s leading slot with a check while preserving a 24px empty slot for unselected items.
- `RMenu` accepts `align="start" | "end"` to align the menu with the trigger's inline-start or inline-end edge. This is logical alignment and follows RTL automatically.
