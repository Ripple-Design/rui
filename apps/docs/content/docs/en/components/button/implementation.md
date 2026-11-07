---
title: Button
docSlug: components/button
tab: implementation
locale: en
designOrder: 70
developOrder: 70
api: /en/api/button
---



## Basic usage


::demo-block{title="Button variants" demo="ButtonBasicDemo" language="vue"}
::


::demo-block{title="Button row" demo="ButtonRowBasicDemo" language="vue"}
::


`RButton` supports direct `icon` and `endIcon` props for common cases, but the `leading` and `trailing` slots remain available for arbitrary custom content. When both a slot and a prop are supplied on the same side, the slot content wins.
