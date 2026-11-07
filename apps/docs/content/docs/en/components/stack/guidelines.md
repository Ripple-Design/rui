---
title: Stack
docSlug: components/stack
tab: guidelines
locale: en
designOrder: 40
developOrder: 40
api: /en/api/stack
---

## Usage

Use Stack when content needs one-dimensional layout along a single axis.

### Good fits

- Vertical form sections
- Button rows and action groups
- Small card internals
- Wrapping tag or chip lists

### Prefer Grid when both axes matter

If a layout needs coordinated rows and columns, use Grid instead.

### Direction and wrapping

Use the default column direction for vertical layouts. Switch to `direction="row"` when items should flow horizontally, and enable `wrap="wrap"` when row layouts need to break onto multiple lines.

### Convenience wrappers

Use `RRow` when content should always flow horizontally, and `RColumn` when content should always flow vertically. They are convenience wrappers over `RStack` and share the same spacing and alignment props.
