---
title: Progress Indicator
docSlug: components/progress-indicator
tab: implementation
locale: en
designOrder: 147
developOrder: 147
api: /en/api/progress-indicator
---



## Basic usage


::demo-block{title="Circular and linear progress indicators" demo="ProgressIndicatorBasicDemo" language="vue"}
::


`RCircularProgressIndicator` and `RLinearProgressIndicator` provide determinate and indeterminate progress feedback. Circular indicators support 24 / 36 / 48 sizes, reversed direction, and indeterminate color cycling via `indicatorColors`, while linear indicators support buffer, explicit `direction`, and both `disjoint` / `contiguous` indeterminate modes.

Determinate progress uses a shared no-bounce spring for circular and linear indicators, starting from the currently displayed value when a new target arrives. Indeterminate motion remains CSS-driven: `disjoint` keeps two staggered pulse segments and drains the active cycle when stopped, while `contiguous` renders three adjoining color segments and returns to determinate immediately.
