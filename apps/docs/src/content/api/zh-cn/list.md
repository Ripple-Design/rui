---
title: 列表 API
routeSlug: list
locale: zh-cn
docs: /zh-cn/components/list/spec
designOrder: 147
developOrder: 147
---

## 导入

```ts
import { RList, RListGroup, RListItem } from "@ripple-design/rui"
```

## 用法

```vue
<RList divider="inset">
  <RListGroup label="邮箱">
    <RListItem :icon="RIInboxOutlined" action @click="openInbox">收件箱</RListItem>
    <RListItem href="/archive">归档</RListItem>
  </RListGroup>
</RList>
```

## 组件

### `RList`

- `divider`: `"none" | "inset" | "full-bleed"`，默认 `"none"`。
- 默认插槽：`RListItem` 和 `RListGroup`。

### `RListGroup`

- `label`：可见且可访问的分组标题。
- `divider`：在后续分组之前绘制带 8px 间距的 1px 分隔线；默认 `true`。
- 插槽：默认分组内容和可选的 `header`。

### `RListItem`

- `action`：未设置 `href` 时渲染原生按钮。
- `href`、`target`、`rel`：渲染原生链接。
- `lines`：`1 | 2 | 3`；省略时根据 `supporting` 与 `tertiary` 插槽推断。
- `icon` 与 `leading` 提供前导内容；`leading` 的优先级更高。
- `disabled`：阻止按钮或链接激活。
- `ripple`：`boolean | RippleOptions`；可交互行默认使用有边界、低对比度的 ripple。
- 插槽：默认标题、`leading`、`supporting`、`tertiary` 和展示用途的 `trailing`。
- 事件：可操作行激活时触发 `click`。

静态行保持原生列表语义且不可聚焦。不要在按钮/链接行的 `trailing` 插槽放入其他可交互控件。
