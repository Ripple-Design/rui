---
title: Navigation rail
docSlug: components/navigation-rail
tab: implementation
locale: en
designOrder: 160
developOrder: 160
api: /en/api/navigation-rail
---



## Basic usage


::demo-block{title="Basic navigation rail" demo="NavigationRailBasicDemo" language="vue"}
::


`RNavigationRail` and `RNavigationRailItem` provide a compact vertical destination list with a shared single-selection model. Use `labelVisibility="selected"` when only the active destination should show its label, `compact` when the rail should switch to 56px icon-only cells, and `selected-icon` when an item should swap to a different icon while selected.
