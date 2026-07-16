---
title: 网格
docSlug: components/grid
tab: spec
locale: zh-cn
designOrder: 30
developOrder: 30
api: /zh-cn/api/grid
---

## 结构

Grid 是一个用于按行和列排列直接子元素的布局原语。

当 `cols` 为数字时，会生成 `repeat(n, minmax(0, 1fr))` 形式的等宽列轨道。
当 `cols` 为字符串时，会直接透传为原生 CSS Grid 模板值，以支持更高级的布局定义。
