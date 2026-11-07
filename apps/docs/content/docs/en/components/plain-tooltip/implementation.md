---
title: Plain tooltip
docSlug: components/plain-tooltip
tab: implementation
locale: en
designOrder: 145
developOrder: 145
api: /en/api/plain-tooltip
---



## Basic usage


::demo-block{title="Plain tooltip states" demo="PlainTooltipBasicDemo" language="vue"}
::


`v-tooltip` is the primary API for lightweight anchored hints. Apply it directly to the real control so the tooltip binds to the correct element without introducing extra layout wrappers. `RPlainTooltip` remains the internal render primitive used by the directive.
