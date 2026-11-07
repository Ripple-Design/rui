---
title: Grid
docSlug: components/grid
tab: implementation
locale: en
designOrder: 30
developOrder: 30
api: /en/api/grid
---



## Basic usage


::demo-block{title="Basic grid" demo="GridBasicDemo" language="vue"}
::


## Auto-fit layout


::demo-block{title="Auto-fit grid" demo="GridAutoFitDemo" language="vue"}
::


## Responsive columns

Grid accepts either viewport breakpoints (`sm`, `md`, `lg`, `xl`) or container breakpoints (`csm`, `cmd`, `clg`, `cxl`) for `cols`.


::demo-block{title="Responsive columns" demo="GridResponsiveColsDemo" language="vue"}
::


## Responsive item spans

Grid item span directives accept the same responsive object forms, so layouts can change item width across viewport or container breakpoints without JavaScript measurement.


::demo-block{title="Responsive spans" demo="GridResponsiveSpanDemo" language="vue"}
::

