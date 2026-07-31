---
title: Progress Indicator API
routeSlug: progress-indicator
locale: en
docs: /en/components/progress-indicator/implementation
designOrder: 147
developOrder: 147
---

## Import

```ts
import { RCircularProgressIndicator, RLinearProgressIndicator } from "@ripple-design/rui"
```

## Notes

- `RCircularProgressIndicator` supports `progress`, `indeterminate`, `closed`, `size`, and `fourColor`.
- `RLinearProgressIndicator` supports `progress`, `buffer`, `indeterminate`, `closed`, and `reversed`.
- Both components expose `role="progressbar"` semantics and remove `aria-valuenow` in indeterminate mode.
