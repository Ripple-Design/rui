# Scaffold API

## RScaffold

### Props

```ts
export type RScaffoldScrollDirection = "vertical" | "horizontal" | "none"

export type RScaffoldProps = {
    scrollDirection?: RScaffoldScrollDirection
}

export type RScaffoldScrollState = {
    top: number
    direction: "up" | "down" | "idle"
}

export type RScaffoldAppBarState = "expanded" | "collapsed"

export type RScaffoldContext = {
    scrollDirection: Readonly<Ref<RScaffoldScrollDirection>>
    scrollState: Readonly<Ref<RScaffoldScrollState>>
    appBarState: Readonly<Ref<RScaffoldAppBarState>>
    bodyGridMode: Readonly<Ref<RResponsiveContainerMode | null>>
    setBodyGridMode: (mode: RResponsiveContainerMode) => void
}
```

```ts
const defaultProps: RScaffoldProps = {
    scrollDirection: "vertical",
}
```

#### `scrollDirection`

| 值           | 说明               |
| ------------ | ------------------ |
| `vertical`   | 纵向滚动内容区域   |
| `horizontal` | 横向滚动内容区域   |
| `none`       | 不建立滚动内容区域 |

#### `grid`

| 值           | 说明                  |
| ------------ | --------------------- |
| `full-width` | Body 使用可用容器宽度 |
| `centered`   | Body 使用居中容器宽度 |

### Slots

```ts
export type RScaffoldSlots = {
    "app-bar"?: () => unknown
    navigation?: () => unknown
    default?: () => unknown
    "side-sheet"?: () => unknown
    "bottom-bar"?: () => unknown
    fab?: () => unknown
    modal?: () => unknown
}
```

| Slot         | 内容                                     |
| ------------ | ---------------------------------------- |
| `app-bar`    | `RAppBar`                                |
| `navigation` | `RNavigationDrawer` 或 `RNavigationRail` |
| `default`    | Body 内容                                |
| `side-sheet` | `RSideSheet` 或 `RModalSideSheet`        |
| `bottom-bar` | `RBottomNavigation`                      |
| `fab`        | `RFab`                                   |
| `modal`      | 模态语义内容，不提供实际 CSS 布局        |

### CSS 状态属性

```html
data-rui-scaffold-axis="vertical|horizontal|none" data-rui-scaffold-grid="full-width|centered"
data-rui-scaffold-bars="visible|hidden" data-rui-scaffold-app-bar="expanded|collapsed"
```

### CSS 变量

```css
--rui-sys-scaffold-collapse-progress: <number>;
--rui-comp-scaffold-app-bar-fab-top: <length>;
--rui-comp-scaffold-app-bar-fab-end: <length>;
```

### 示例

```vue
<RScaffold scroll-direction="vertical">
    <template #app-bar>
        <RAppBar content-align="body" />
    </template>

    <template #navigation>
        <RNavigationRail />
    </template>

    <template #default>
        <PageContent />
    </template>

    <template #side-sheet>
        <RSideSheet />
    </template>

    <template #bottom-bar>
        <RBottomNavigation />
    </template>

    <template #fab>
        <RFab placement="app-bar-seam" />
    </template>

    <template #modal>
        <ModalContent />
    </template>
</RScaffold>
```

## RResponsiveContainer

### Props

```ts
export type RResponsiveContainerMode = "full-width" | "centered"

export type RResponsiveContainerProps = {
    mode?: RResponsiveContainerMode
    maxWidth?: string
}
```

```ts
const defaultProps: RResponsiveContainerProps = {
    mode: "centered",
}
```

#### `mode`

| 值           | 说明                                     |
| ------------ | ---------------------------------------- |
| `full-width` | 内容区域使用当前容器的全部可用宽度       |
| `centered`   | 内容区域居中，并在达到最大宽度后保持固定 |

#### `maxWidth`

```ts
maxWidth?: string
```

设置 `centered` 模式下的最大内容宽度。未设置时使用 Scaffold 的响应式宽度规则。

### 响应式网格

`RResponsiveContainer` 负责 Body 的 Margin 和宽度模式，`RResponsiveGrid` 负责默认的 M2 内容列数。使用 `RResponsiveGrid` 时，不需要手动配置 `RGrid` 的 4/8/12 列响应值：

```vue
<RResponsiveContainer mode="centered">
    <RResponsiveGrid>
        <PageContent />
    </RResponsiveGrid>
</RResponsiveContainer>
```

也可以直接使用 `RResponsiveGrid`，由它同时提供响应式容器和列布局：

```vue
<RResponsiveGrid mode="centered">
    <PageContent />
</RResponsiveGrid>
```

### RResponsiveGrid

#### Props

```ts
export type RResponsiveGridProps = {
    mode?: RResponsiveContainerMode
    maxWidth?: string
    gap?: CSSProperties["gap"]
    columnGap?: CSSProperties["columnGap"]
    rowGap?: CSSProperties["rowGap"]
}
```

```ts
const defaultProps: RResponsiveGridProps = {
    mode: "centered",
}
```

`RResponsiveGrid` 根据当前容器宽度自动使用 M2 的 4/8/12 列规则，并将列数传递给内部 `RGrid`。

| Screen size | Margin | Body | Layout columns |
| --- | --- | --- | ---: |
| 0–599dp | 16dp | Scaling | 4 |
| 600–904dp | 32dp | Scaling | 8 |
| 905–1239dp | Scaling，最大 200dp | 固定 840dp | 12 |
| 1240–1439dp | 200dp | Scaling | 12 |
| 1440dp 及以上 | Scaling | 默认最大 1040dp | 12 |

```ts
export type RResponsiveGridColumns = 4 | 8 | 12

export type RResponsiveGridRule = {
    minWidth: string
    margin: string
    body: "scaling" | string
    columns: RResponsiveGridColumns
}
```

规则：

- 0–599dp 使用 16dp Margin、可伸缩 Body 和 4 列；
- 600–904dp 使用 32dp Margin、可伸缩 Body 和 8 列；
- 905–1239dp 使用固定 840dp Body，Margin 弹性增长至最大 200dp，并使用 12 列；
- 1240–1439dp 使用 200dp Margin、可伸缩 Body 和 12 列；
- 1440dp 以上默认使用最大 1040dp 的 Centered Body，Margin 弹性增长，并使用 12 列；
- 桌面端选择 `mode="full-width"` 时，Body 不受 1040dp 最大宽度限制，继续使用可用宽度和 12 列；
- 响应式规则根据当前容器宽度计算，不根据浏览器视口直接计算。

### Slots

```ts
export type RResponsiveGridSlots = {
    default?: () => unknown
}
```

### 示例

```vue
<RResponsiveGrid mode="centered">
    <PageContent />
</RResponsiveGrid>
```

## RAppBar

### Props

```ts
export type RAppBarContentAlign = "full-width" | "centered" | "body"

export type RAppBarProps = {
    contentAlign?: RAppBarContentAlign
    collapsing?: boolean
    hideOnScroll?: boolean
    underlap?: boolean
    expandedHeight?: string
    collapsedHeight?: string
}
```

```ts
const defaultProps: RAppBarProps = {
    contentAlign: "full-width",
    collapsing: false,
    hideOnScroll: false,
    underlap: false,
    collapsedHeight: "64dp",
}
```

#### `contentAlign`

| 值           | 说明                           |
| ------------ | ------------------------------ |
| `full-width` | 内容使用全部可用宽度           |
| `centered`   | 内容与居中网格对齐             |
| `body`       | 继承当前 `RScaffold` 的 `grid` |

#### `collapsing`

```ts
collapsing?: boolean
```

启用 AppBar 内容折叠状态。

#### `hideOnScroll`

```ts
hideOnScroll?: boolean
```

启用滚动隐藏和反向滚动显示。

#### `underlap`

```ts
underlap?: boolean
```

允许指定的 Body 内容初始位于展开态 AppBar 的覆盖区域内。

#### `expandedHeight`

```ts
expandedHeight?: string
```

AppBar 展开高度。

#### `collapsedHeight`

```ts
collapsedHeight?: string
```

AppBar 折叠高度，默认值为 `64dp`。

### CSS 变量

```css
--rui-sys-scaffold-collapse-progress: <number>;
```

## RFab

### Props

```ts
export type RFabPlacement = "viewport" | "body" | "app-bar-seam"

export type RFabProps = {
    placement?: RFabPlacement
}
```

`RFabProps` 同时包含现有 FAB Props：

```ts
export type RFabProps = {
    variant?: RFabVariant
    size?: RFabSize
    icon?: RIconResolvableSource
    label?: string
    visible?: boolean
    extended?: boolean
    disabled?: boolean
    type?: RButtonType
    href?: string
    target?: string
    rel?: string
    ripple?: boolean | RippleOptions
    placement?: RFabPlacement
}
```

#### `placement`

| 值             | 锚点                |
| -------------- | ------------------- |
| `viewport`     | Scaffold 视口       |
| `body`         | Body 内容区域       |
| `app-bar-seam` | AppBar 与 Body 接缝 |

`app-bar-seam` 要求所属 `RAppBar` 保持展开，不启用 `collapsing`。
