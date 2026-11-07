---
title: Tab
docSlug: components/tab
tab: implementation
locale: en
designOrder: 72
developOrder: 72
api: /en/api/tab
---



## Basic usage


::demo-block{title="Primary and secondary tab bars" demo="TabBarBasicDemo" language="vue"}
::


## Overflow


::demo-block{title="Scrollable tab bars" demo="TabBarOverflowDemo" language="vue"}
::


## Icon layout


::demo-block{title="Icon layout and full-width tabs" demo="TabBarIconLayoutDemo" language="vue"}
::


## Appearance


::demo-block{title="Divider and semantic colors" demo="TabBarAppearanceDemo" language="vue"}
::


`RTabBar` manages a value-based selection model across `RTab` children. Use `v-model` to control the active tab, `fullWidth` to evenly distribute items, `iconLayout` on `RTabBar` to set the default icon/label direction for child tabs, `divider` to show or hide the bottom rule, and `color` to choose one of the built-in semantic treatments: `primary`, `secondary`, `on-primary`, or `on-secondary`. Individual `RTab` items can override icon layout when needed. Use the `on-*` colors when the tab bar sits on the matching filled surface. Tabs render at 48px height by default, use a 72px vertical icon layout when icons stack above labels, and clamp each tab between 90px and 360px wide.
