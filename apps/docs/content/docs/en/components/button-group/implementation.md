---
title: Button group
docSlug: components/button-group
tab: implementation
locale: en
designOrder: 71
developOrder: 71
api: /en/api/button-group
---



## Basic usage


::demo-block{title="Attached, selectable, and full-width button groups" demo="ButtonGroupBasicDemo" language="vue"}
::


`RButtonGroup` groups existing `RButton` children without replacing their own props or semantics. Use the group `variant` prop to apply a shared visual treatment, enable `selection="single"` or `selection="multiple"` when the group should manage selected values via `v-model`, and use `fullWidth` when every child button should evenly divide the available inline space.
