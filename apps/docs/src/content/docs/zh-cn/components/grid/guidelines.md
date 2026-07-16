---
title: 网格
docSlug: components/grid
tab: guidelines
locale: zh-cn
designOrder: 30
developOrder: 30
api: /zh-cn/api/grid
---

## 适用时机

当内容需要同时沿行和列进行二维排布时，使用 Grid。

### 适合的场景

- 卡片集合
- 仪表盘分区
- 多列表单分组
- 基于 `minmax()` 或 `auto-fit` 的响应式布局

### 优先选择更简单的布局

如果内容只需要单一轴向排列，优先使用更简单的流式布局或 flex 布局，而不是 Grid。

### 响应式行为

优先采用移动优先的轨道定义。对于等宽列，数字 `cols` 通常已经足够；对于更自适应的布局，可以传入原生 CSS Grid 模板字符串，例如 `repeat(auto-fit, minmax(12rem, 1fr))`。
