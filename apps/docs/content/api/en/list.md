---
title: List API
routeSlug: list
locale: en
docs: /en/components/list/spec
designOrder: 147
developOrder: 147
---

## Import

```ts
import { RList, RListGroup, RListItem } from "@ripple-design/rui"
```

## Usage

```vue
<RList divider="inset">
  <RListGroup label="Mailbox">
    <RListItem :icon="RIInboxOutlined" action @click="openInbox">Inbox</RListItem>
    <RListItem href="/archive">Archive</RListItem>
  </RListGroup>
</RList>
```

## Components

### `RList`

- `divider`: `"none" | "inset" | "full-bleed"`; defaults to `"none"`.
- Default slot: `RListItem` and `RListGroup` entries.

### `RListGroup`

- `label`: optional visible and accessible section heading.
- `divider`: adds an 8px-spaced 1px separator before a following group; defaults to `true`.
- Slots: default group entries and optional `header`.

### `RListItem`

- `action`: renders a native button when no `href` is supplied.
- `href`, `target`, `rel`: render a native link.
- `lines`: `1 | 2 | 3`; inferred from `supporting` and `tertiary` slots when omitted.
- `icon` and `leading` provide leading content; `leading` wins over `icon`.
- `disabled`: prevents an action or link from activating.
- `ripple`: `boolean | RippleOptions`; interactive rows use bounded, low-contrast ripple by default.
- Slots: default (title), `leading`, `supporting`, `tertiary`, and presentational `trailing`.
- Emits: `click` for activated action rows.

Static rows have native list semantics and are not focusable. Do not place another interactive control in the `trailing` slot of a button/link row.
