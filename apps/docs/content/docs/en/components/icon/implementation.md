---
title: Icon
docSlug: components/icon
tab: implementation
locale: en
designOrder: 50
developOrder: 50
api: /en/api/icon
---



## Basic usage


::demo-block{title="Basic icon" demo="IconBasicDemo" language="vue"}
::


`RIcon` now accepts three input modes:

- string icon sources
- component icon sources
- slot-based custom content

When both a slot and an `icon` prop are provided, the slot content takes precedence.
