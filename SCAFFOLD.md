# RUI Scaffold 架构方案（M2）

## 1. 目的与范围

`RScaffold` 是用于构建应用页面骨架的基础组件，负责组织导航栏、顶部应用栏、内容区域和上下文面板。它是布局协调器，不负责页面路由，也不替代它所承载的 M2 组件。

系统围绕以下四项原则设计：

- **CSS 驱动布局：** 区域占位由 Grid/Flex 的正常布局流自然产生，不依赖运行时尺寸测量。
- **全宽表面与局部对齐：** 视觉表面可以贯穿整个骨架，而内部内容通过统一容器契约对齐。
- **容器驱动自适应：** 内容根据其在 Scaffold 内实际可用的宽度变化，而不是只根据浏览器视口宽度变化。
- **变换驱动动态效果：** 滚动时的显示、隐藏和折叠不改变文档流，避免页面跳动。

第一阶段应先建立稳定的基础契约和标准骨架路径。折叠顶栏、Hero 重叠布局和接缝锚定 FAB 都应作为建立在这些契约之上的扩展能力。

## 2. 组件拓扑

```text
RScaffold
├── RAppBar                可选，最多一个
├── RNavigationDrawer      可选，负责抽屉或导航轨
├── Body 内容区域          必需，滚动与内容视口
├── RSideSheet             可选，末端上下文面板
├── RBottomNavigation      可选，底部导航或底部应用栏
```

上面的区域通过命名插槽提供，不新增 `RScaffold*` 包装组件。Scaffold 直接复用现有的 `RAppBar`、`RNavigationDrawer`、`RNavigationRail`、`RSideSheet` 和 `RBottomNavigation`。Controller 只发布布局状态，不依赖区域的具体视觉实现。

Scaffold 根节点额外提供独立的 FAB 定位层。该层不参与普通 Grid/Flex 内容流，允许 `RFab` 处理 Hero 接缝、Collapsing AppBar 接缝、BottomNavigation 避让和跨层叠放。FAB 的 slot 位置属于当前 Scaffold；嵌套 Scaffold 的 FAB 不得穿透或覆盖外层 Scaffold 的定位层。

### 2.1 Controller 职责

`RScaffold` 负责以下状态和行为：

1. 提供固定的命名插槽和 Shell 布局结构。
2. 监听指定 Body 滚动容器的滚动位置。
3. 计算滚动方向和折叠进度等交互状态。
4. 在 Scaffold 根节点发布 CSS 状态属性和交互变量。
5. 为 `#fab` 插槽提供独立的定位层，不让 FAB 参与普通 Body 布局流。
6. 仅在区域为模态模式时协调模态阻塞和 Body 交互。
7. 为 Scaffold 自身及其后代提供必要的 Vue Context。

区域的尺寸和占位由 CSS Grid/Flex 负责。Controller 不读取或缓存区域的运行时尺寸，也不负责路由选择、面板业务状态或任意子元素定位。这些职责属于使用方或具体组件。

### 2.2 插槽契约

第一版公共组合方式应支持命名插槽，使现有组件能够组合使用，同时避免与 Controller 的实现细节耦合：

```vue
<RScaffold>
  <template #top-bar>
    <RAppBar />
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
    <RFab />
  </template>
</RScaffold>
```

### 2.3 RAppBar 内容对齐

`RAppBar` 的背景、Elevation 和边界保持全宽，但其内部内容可以选择是否与 Body 的网格容器对齐。AppBar 不自行复制 Body 的 Margin、最大宽度或断点计算，而是复用同一个 `RContainer` 契约。

建议的内容对齐模式：

| 模式 | 行为 |
| --- | --- |
| `full-width` | 内容使用 AppBar 当前可用的全部宽度 |
| `centered` | 内容使用 Centered grid 的最大宽度和两侧 Margin |
| `body` | 继承当前 Scaffold Body 的 Full-width 或 Centered 模式 |

```vue
<RScaffold>
  <template #top-bar>
    <RAppBar content-align="body" />
  </template>

  <template #default>
    <PageContent />
  </template>
</RScaffold>
```

`body` 模式只继承 Body 的容器宽度策略，不继承 Body 的滚动状态。桌面端 Body 使用 Full-width grid 时，AppBar 内容也可以自动保持 Full-width；Body 使用 Centered grid 时，AppBar 内容自动与最大 1040dp 的 Body 对齐。

### 2.4 Body 滚动方向 API

Body 内容区域支持三种滚动方向配置：

```vue
<RScaffold scroll-axis="vertical">
  <template #default>
    <PageContent />
  </template>
</RScaffold>
```

| `scroll-axis` | 语义 | 当前实现 |
| --- | --- | --- |
| `vertical` | Body 建立纵向滚动容器，并作为当前 Scaffold 的滚动状态来源 | 已实现目标 |
| `horizontal` | Body 建立横向滚动容器，供横向工作区或时间线使用 | 仅提供 API，暂不实现 |
| `none` | Body 不建立 Scaffold 管理的滚动容器 | 已实现目标 |

该配置属于每个 Scaffold 自己的布局边界。嵌套 Scaffold 可以选择不同的 `scroll-axis`：外层可以是 `vertical`，内层可以是 `none`；内层 `horizontal` 只作为预留 API，不得被当前滚动状态机当作可用的横向实现。

当 `scroll-axis="none"` 时，`RAppBar` 的 `hide-on-scroll`、`collapsing` 和依赖滚动进度的 Hero 状态不应由该 Scaffold 自动触发。需要滚动联动时，应用必须通过显式状态控制对应组件。

## 3. 空间布局模型

根节点是一个全尺寸布局上下文。直接布局区域与局部内容包装器相互分离：

```text
Scaffold 根节点
└── shell grid / flex 布局
    ├── navigation 区域
    └── main shell
        ├── top-bar 全宽区域
        ├── body 视口
        │   └── local content container
        ├── side-sheet 区域
        ├── bottom-bar 全宽区域
    └── fab 独立定位层
```

具体使用 Grid 还是 Flex 可以在实现时决定，但必须满足以下不变量：

- Scaffold 作为应用骨架使用时，根节点具有确定的行内尺寸和块尺寸。
- Body 可以收缩到小于内容的固有宽度（`min-width: 0`）。
- `RScaffold` 的 Body 内容区域通过 `scroll-axis` 声明滚动方向：`vertical`、`horizontal` 或 `none`；
- 第一阶段实现 `vertical`；`horizontal` 先提供 API 和类型契约，不实现横向滚动行为；
- `none` 表示 Body 不建立滚动容器，内容溢出行为由应用层或页面内容自行决定；
- Standard Side Sheet 消耗布局宽度；Modal Side Sheet 覆盖在 Body 上方。
- TopBar 和 BottomBar 即使视觉层通过变换移出视口，仍然保留在 CSS 布局流中的占位空间。
- 全宽区域负责背景和层级；需要对齐的内容嵌套在局部容器中。

### 3.1 全宽层与局部容器层

全宽区域负责贯穿 Scaffold 的宽度，并处理 Surface、Elevation、Shape 和 Scrim。其内部内容可以选择使用 `RContainer`，从而继承 Scaffold 的对齐边缘。

`RContainer` 是统一对齐原语。它应通过系统变量提供最大行内尺寸和两侧间距契约，使 TopBar、Body、Side Sheet Header 和 BottomBar 中的内容无需共享同一个祖先内容盒子也能保持对齐。

容器契约必须支持：

- 最小行内间距；
- 可配置的最大内容宽度；
- 使用逻辑属性 `padding-inline` 支持 RTL；
- 嵌套使用时不重复叠加 Scaffold 外部间距；
- 为有意贯穿全宽的内容提供退出局部容器约束的能力。

## 4. 布局契约

### 4.1 CSS 占位与嵌套隔离

区域占位完全由 Scaffold 的 CSS Grid/Flex 布局流产生，不建立运行时几何测量、尺寸上报或 Inset 计算引擎。TopBar、BottomBar、Navigation 和 Standard Side Sheet 的实际尺寸由它们自身的 CSS 参与布局。

每个 `RScaffold` 都是独立的布局和状态边界。外层 Scaffold 不读取、覆盖或合并内层 Scaffold 的滚动状态；内层 Scaffold 也不继承外层栏位的布局占位。外层 Body 中可以直接嵌套完整的 Scaffold：

```vue
<RScaffold>
  <template #default>
    <RScaffold>
      <template #default>
        <NestedPage />
      </template>
    </RScaffold>
  </template>
</RScaffold>
```

嵌套时必须满足：

- 内层 Scaffold 作为外层 Body 的普通内容项参与布局；
- 内层根节点使用 `min-width: 0`，并通过父级提供确定的可用高度；
- 内层 Body 默认只拥有自己的滚动区域，不监听外层滚动容器；
- 内层 Container Query 只查询内层 Body 的直接容器宽度；
- 内外层的 `data-rui-scaffold-*` 状态属性和 `--rui-sys-scaffold-*` 变量互不覆盖；
- 内层的 TopBar、BottomNavigation、Navigation 和 Side Sheet 只影响内层布局；
- Modal 区域的遮罩和焦点管理只作用于所属 Scaffold 的交互边界。

FAB、Snackbar 等浮层不属于普通 Body 内容流。FAB 使用独立的 `#fab` 插槽；Snackbar 等其他浮层由自身组件或应用层决定挂载位置。需要避让时使用所在 Scaffold 的显式布局间距，而不是读取由 Scaffold 动态测量生成的 Inset。

### 4.2 Container Query 契约

Body 内容包装器建立查询容器：

```css
container-type: inline-size;
```

内容网格使用现有的容器断点命名（`csm`、`cmd`、`clg`、`cxl`）和 `RGrid` 的容器响应模式。Scaffold 专用 CSS 不应引入第二套断点体系。

建议的默认映射为：

- 紧凑 Body：4 列；
- 中等 Body：8 列；
- 展开 Body：12 列。

这只是页面组合的默认建议，并不是所有页面的强制要求。Side Sheet 展开后会缩小 Body 的查询宽度，使内部网格自动调整，而不需要 Controller 编写断点分支。

### 4.3 M2 响应式网格基准

Scaffold 的 Body 网格遵循 M2 的窗口、Margin 和 Body 宽度规则。这里的 `Window` 是当前可用的窗口或 Body 容器宽度，`Margin` 是 Body 两侧的外部间距，`Body` 描述内容区域是持续伸缩还是达到最大宽度后固定。设备旋转时，以较小的可用宽度作为响应式判断依据。

| Screen size | Margin | Body | Layout columns |
| --- | --- | --- | ---: |
| Extra-small（phone）0–599dp | 16dp | Scaling | 4 |
| Small（tablet）600–904dp | 32dp | Scaling | 8 |
| 905–1239dp | Scaling，最大 200dp | 固定 840dp | 12 |
| Medium（laptop）1240–1439dp | 200dp | Scaling | 12 |
| Large（desktop）1440dp 及以上 | Scaling | 默认最大 1040dp；可选 Full-width | 12 |

响应规则如下：

- **0–599dp：** Margin 的基准值为 16dp，Body 随可用宽度响应式伸缩，使用 4 列。
- **600–904dp：** 进入 Small 断点后，Margin 增加到 32dp，Body 继续伸缩，使用 8 列。
- **905–1239dp：** 当 Body 宽度达到 840dp 后，Margin 转为弹性值并逐步增加，最大为 200dp；Body 保持 840dp，使用 12 列。
- **1240–1439dp：** 达到最大 200dp Margin 后，Body 恢复水平响应式伸缩，使用 12 列。
- **1440dp 及以上：** 默认使用 Centered grid，Body 最大宽度为 1040dp，Margin 随窗口宽度弹性伸缩；对于工作区、数据表和多栏操作页面，可以显式切换为 Full-width grid，使 Body 继续随可用宽度伸缩，使用 12 列。

### 4.4 Body 网格容器模式

Scaffold 使用同一套 4/8/12 列网格，但允许 Body 选择不同的宽度策略：

| 模式 | Body 宽度 | Margin | 适用页面 |
| --- | --- | --- | --- |
| Full-width grid | 随可用容器宽度伸缩 | 固定或受约束 | 工作区、数据表、多栏操作页面 |
| Centered grid | 达到最大宽度后固定 | 两侧自动增长 | 文章、详情、表单和阅读型页面 |

这两种模式不是两套断点系统，也不是两套列定义。它们共享相同的 Container Query、列数、列间距和内容对齐规则，只改变 Body 的宽度策略。

桌面端默认使用 Centered grid：Body 最大宽度为 1040dp，剩余空间由两侧 Margin 吸收。但为了最大化视图，页面可以显式选择 Full-width grid；此时 1440dp 以上的 Body 不再受 1040dp 最大宽度限制，而是继续占用当前 Scaffold 提供的可用宽度，并保持 12 列。

```text
Centered grid:
| flexible margin | fixed body (max 1040dp) | flexible margin |

Full-width grid:
| margin | responsive body | margin |
```

布局模式必须属于当前 Body 的局部配置。嵌套 Scaffold 可以独立选择自己的模式，不能因为外层使用 Centered grid 就强制内层采用 Centered grid；同样，Standard Side Sheet 只改变内层可用容器宽度，不改变页面已选择的模式。

- Margin、Body 最大宽度和列数属于 Body 的局部布局，不改变外层 Scaffold 区域的 CSS 占位；
- `RContainer` 负责共享 Margin、最大 Body 宽度和 `padding-inline` 对齐，不由 `RScaffold` 读取子区域几何信息后再计算；
- 嵌套 Scaffold 只继承父级提供的可用容器宽度，不继承父级的 Margin、Body 最大宽度或列数状态；
- 当 Standard Side Sheet 挤压 Body 时，内层网格只根据挤压后的容器宽度选择列数，不使用浏览器视口宽度；
- 超过 1440dp 后，Body 最大宽度为 1040dp，剩余空间由两侧 Margin 吸收。

## 5. 交互状态机

### 5.1 滚动显示与隐藏

只有 `scroll-axis="vertical"` 的 Scaffold 才能驱动 `RAppBar` 的 `hide-on-scroll` 和 `collapsing`。`horizontal` 当前仅是预留 API，`none` 不提供自动滚动状态来源。

`RAppBar` 支持 `hide-on-scroll`。Controller 只监听当前 Scaffold 的 Body 滚动容器，并将滚动方向发布为 Scaffold 状态；AppBar 通过 CSS Transform 隐藏或显示。TopBar 的布局占位始终由 CSS 保留，隐藏只改变视觉层，不造成 Body 布局跳动。

Controller 根据当前 Body 滚动拥有者的滚动增量计算滚动方向：

```text
idle
 ├── 向下增量超过隐藏阈值 ──> hidden
 ├── 向上增量超过显示阈值 ──> visible
 └── 没有有效增量          ──> idle
```

规则如下：

- 在滚动起点，所有栏位保持显示。
- 向下移动必须累计超过较小阈值后才隐藏。
- 在页面任意深度，只要向上移动达到显示阈值，就立即显示栏位。
- 状态切换期间 Body 的布局间距不发生变化。
- 用户启用减少动态效果时，状态仍然切换，但不执行变换动画。
- 过度滚动和弹性负值不能导致错误的反复显示与隐藏。

Controller 发布类似下面的状态属性，CSS 负责变换和过渡：

```html
data-rui-scaffold-bars="visible|hidden"
```

### 5.2 折叠型 TopBar

`RAppBar` 支持 `collapsing` 模式。展开状态和折叠状态属于同一个 AppBar 的连续视觉状态，布局占位由 CSS Grid 保持稳定；折叠只改变内部标题、导航元素和 Surface 状态，不改变 Body 的滚动起点。

折叠型 TopBar 提供归一化的滚动进度：

```text
p = clamp(scrollTop / collapseDistance, 0, 1)
```

Controller 发布：

```css
--rui-sys-scaffold-collapse-progress: 0.1;
```

展开高度和折叠高度通过 Props 或 CSS 变量显式配置。标题应保留稳定的布局盒子，并通过变换插值完成折叠，而不是在滚动过程中修改 `font-size`。透明度、位移、缩放和 Elevation 可以由进度变量驱动。

标准折叠目标为 64dp。展开目标根据选定的 M2 Top App Bar 变体，可以是 112dp 或 152dp。

### 5.3 `underlap`：展开态 AppBar 下的内容重叠

`RAppBar` 在 `collapsing` 模式下可以启用 `underlap`，允许 Body 的指定内容初始进入展开态 AppBar 的空间，而不是从 AppBar 下方开始排布。

```vue
<RAppBar
  collapsing
  underlap
  content-align="body"
/>
```

该模式的空间关系如下：

```text
展开状态：
┌──────────────────────────────┐
│ RAppBar（高层，覆盖 Body）    │
│   ┌────────────────────────┐ │
│   │ Body underlap 内容     │ │
│   └────────────────────────┘ │
└──────────────────────────────┘

滚动状态：
Body 内容向下离开 AppBar 的重叠区域，继续进入可视区域；
内容经过 AppBar 边界时，由 AppBar 的背景层覆盖。
```

实现契约：

- `underlap` 只改变 Body 内容的起始层级和视觉重叠，不改变 Scaffold 的 AppBar 占位或 Body 的滚动范围；
- AppBar 必须建立高于 Body 内容的独立 stacking context，并确保背景层覆盖重叠内容；
- 允许重叠的内容通过单独的 Body 内容层或 `underlap` 标记选择，不能让整个 Body 无条件穿透 AppBar；
- 重叠内容的焦点顺序仍遵循文档顺序，视觉覆盖不能制造不可访问的可交互控件；
- AppBar 的背景、Scrim 和 Elevation 层必须与内容层分离，避免透明背景导致“覆盖”失效；
- `underlap` 与 `hide-on-scroll` 可以同时启用：AppBar 隐藏时，重叠内容恢复可见；AppBar 显示时，内容重新进入覆盖区域；
- 嵌套 Scaffold 的 underlap 只作用于内层 AppBar，不得穿透内层根节点覆盖外层 AppBar。

`underlap` 与 Hero overlap 不同：Hero overlap 是页面表面与 Hero 媒体之间的结构性重叠；`underlap` 是 Body 内容与 AppBar 视觉层之间的可选覆盖关系。

### 5.4 `collapsing` 与 `hide-on-scroll` 的组合

两种模式控制不同维度，允许同时启用：

| 能力 | 控制对象 | 状态结果 |
| --- | --- | --- |
| `collapsing` | AppBar 内部内容 | 展开、压缩、折叠进度 |
| `hide-on-scroll` | AppBar 视觉层 | 显示、隐藏、重新显示 |

组合时遵循以下规则：

- 向下滚动时，AppBar 先按照 `collapsing` 进度压缩内部内容；达到隐藏阈值后，整体视觉层再执行隐藏变换；
- 向上滚动达到显示阈值时，整体 AppBar 先恢复显示，内部折叠进度继续由当前 `scrollTop` 决定；
- 显示/隐藏使用整体层的 `translate`，折叠使用内部元素的 `transform`、`opacity` 和 CSS 变量；
- 两种状态不得重复修改 AppBar 的布局尺寸，不得改变 Body 的滚动范围；
- `prefers-reduced-motion: reduce` 下仍保留最终状态，但取消连续动画；
- 嵌套 Scaffold 只响应自己的 Body 滚动，不触发外层 `RAppBar` 的隐藏或折叠。

建议的组合配置：

```vue
<RAppBar
  content-align="body"
  collapsing
  hide-on-scroll
/>
```

### 5.5 Hero 重叠布局

Hero 模式由三个可以独立渲染的层组成：

1. Hero 媒体或 Banner；
2. 带有初始负重叠量的 Body Surface；
3. 位于内容层上方的 Standard TopBar。

Body Surface 负责顶部 Shape。随着滚动推进，其顶部圆角逐渐减小，并在 Body 到达 TopBar 边界时接近零。重叠量通过显式的 CSS 变量配置，不应通过对滚动拥有者施加负 Transform 实现，从而保持焦点顺序和滚动指标可理解。

所需 CSS 变量：

```css
--rui-comp-scaffold-hero-height
--rui-comp-scaffold-hero-overlap
--rui-comp-scaffold-hero-radius
```

### 5.6 FAB 摆放模式

`#fab` 插槽承载现有的 `RFab`，但 FAB 的摆放方式由当前页面模式决定。FAB 位置不是单一的固定右下角规则，至少需要支持以下模式：

| 模式 | 锚点 | 与 AppBar 的关系 |
| --- | --- | --- |
| `viewport` | Scaffold 视口边缘 | 独立于 AppBar |
| `body` | Body 内容区域 | 随 Body 的显式间距定位 |
| `app-bar-seam` | Collapsing AppBar 与 Body 的接缝 | 固定在接缝层，不随 AppBar 内容折叠 |
| `hero-seam` | Hero 媒体与 Body Surface 的接缝 | 由 Hero 布局的显式 CSS 变量定位 |

### 5.7 AppBar 接缝 FAB

`app-bar-seam` 是 Collapsing AppBar 的特殊 FAB 模式。FAB 的中心点固定在展开态 AppBar 与下方 Body 内容的接缝上：

```text
┌──────────────────────────────┐
│        Collapsing RAppBar     │
├──────────────●───────────────┤  ← RFab 接缝锚点
│           Body 内容           │
└──────────────────────────────┘
```

该模式必须满足：

- FAB 位于独立的定位层，视觉层级高于 AppBar 和 Body；
- FAB 的锚点由显式 CSS 几何变量定义，不通过运行时测量计算；
- `app-bar-seam` 启用后，所属 `RAppBar` 保持展开，不参与滚动折叠；
- `collapsing` 与 `app-bar-seam` 不能同时作用于同一个 AppBar；如果同时配置，以 `app-bar-seam` 的“不折叠”约束为准；
- AppBar 的背景层可以覆盖 Body，但不能覆盖接缝 FAB；
- `hide-on-scroll` 默认不影响 `app-bar-seam` FAB，也不应因此收起所属 AppBar；如果页面需要同步隐藏，必须通过 FAB 的显式模式或 CSS 状态单独开启；
- 内层 Scaffold 的接缝 FAB 只相对于内层 AppBar 和 Body 定位，不穿透内层根节点。

建议的组合方式：

```vue
<RScaffold>
  <template #top-bar>
    <RAppBar />
  </template>

  <template #fab>
    <RFab placement="app-bar-seam" />
  </template>
</RScaffold>
```

`app-bar-seam` 与 `hero-seam` 是两个不同的锚定模式：前者锚定 Collapsing AppBar 与 Body 的接缝，后者锚定 Hero 媒体与 Body Surface 的接缝。两者不得共享隐含的坐标计算或退场逻辑。

### 5.8 Hero 中的 FAB

`RFab` 不是 Scaffold 专用组件，也不需要额外包装。它通过独立的 `#fab` 插槽接入 Scaffold，由 Scaffold 提供定位层；它不参与普通 Body 布局流。

在 Hero 模式下，接缝锚定由 `RFab` 的显式 CSS 配置完成：

```css
.rui-fab--hero-docked {
    position: absolute;
    inset-block-start: var(--rui-comp-scaffold-hero-fab-top);
    inset-inline-end: var(--rui-comp-scaffold-hero-fab-end);
}
```

`RScaffold` 只提供 Hero 状态属性和应用配置的 CSS 变量，不计算 FAB 的运行时坐标。FAB 接近 TopBar 时的缩放、透明度和可聚焦状态由 `RFab` 自身状态与 CSS 负责。浮层位置需要避让 BottomNavigation 时，应使用组件或应用显式设置的间距。

## 6. 导航与侧面板矩阵

### 6.1 Navigation 区域

Navigation 是位于 Start 侧的应用级区域：

| Body 宽度 | Navigation 形态 | 布局影响                      |
| --------- | --------------- | ----------------------------- |
| 紧凑      | Modal Drawer    | 覆盖 Body，并在打开时阻塞交互 |
| 中等      | Navigation Rail | 消耗窄的 Start 侧区域         |
| 展开      | Standard Drawer | 消耗持久化的 Start 侧区域     |

Controller 可以根据可用区域宽度选择默认形态，但应用必须能够显式指定形态。选择状态仍由 Navigation 组件及其 Selection Model 负责。

`RNavigationRail` 已经提供 Rail 层级的基础组件。未来的 Standard Drawer 应共享相同的 Navigation Context，而不是重复实现条目选择逻辑。

### 6.2 Side Sheet 区域

Side Sheet 是位于 End 侧的上下文区域：

| 模式     | 位置              | Body 行为                                 |
| -------- | ----------------- | ----------------------------------------- |
| Modal    | 带 Scrim 的覆盖层 | Body 保持原位，并阻塞交互                 |
| Standard | End 侧持久化区域  | Body 被 Flex 收缩，并重新触发自身网格查询 |

Standard Side Sheet 的桌面端默认宽度为 400px，但必须受到 Scaffold 可用宽度限制。当设计要求面板与屏幕边缘分离时，其外侧间距继承容器契约；内部内容使用 `RContainer` 对齐。

现有的 `RSideSheet` 和 `RModalSideSheet` 继续作为独立的视觉和内容组件。Scaffold 集成只负责把它们放入对应插槽，不将 Modal 的焦点管理迁移到 `RScaffold`。

## 7. CSS 与 Token 规范

所有 Scaffold 变量遵循仓库命名规则：

- 系统变量：`--rui-sys-scaffold-*`；
- 组件变量：`--rui-comp-scaffold-*` 或 `--rui-comp-<component-name>-*`。

Scaffold 样式应复用现有主题中的 Color、Shape、Elevation、Typography 和 Motion Token。如果已有 RUI Token 能表达相同语义，不要额外创建 M2 专用别名。

显示与隐藏状态应使用 CSS 离散状态过渡。连续的滚动插值只能作用于 Transform、Opacity、Radius 以及其他适合合成器处理的属性。动画不得依赖每一帧修改布局尺寸。

关闭状态的 Dialog 类元素不得设置 `display: flex`，必须保留现有的打开生命周期和 Modal 原语行为。

## 8. 可访问性与输入行为

骨架必须保留语义化地标：

- TopBar：`header`；
- Navigation：`nav`；
- 主内容：`main`；
- Standard Side Sheet：`aside`；Modal Side Sheet：使用 Modal Surface 语义；
- BottomBar：根据内容使用 `nav` 或 `footer`。

其他要求：

- 键盘焦点顺序遵循文档顺序，不依赖视觉变换；
- 处于显示状态的变换栏位保持可访问；通过明确状态隐藏时，不应继续成为可聚焦目标；
- Modal 区域复用现有的焦点锁定、焦点返回、Escape 和 Scrim 行为；
- 触摸目标符合现有 Touch Target foundation；
- 使用 Start/End 等逻辑属性支持 RTL；
- 嵌套滚动容器必须显式指定为对应 Scaffold 的 Body 滚动拥有者，默认不启用；
- 在具有屏幕缺口的设备上，Safe Area 通过当前 Scaffold 的 CSS 间距变量处理。

## 9. 实现顺序

### 阶段 1：契约与标准骨架

- 在 `foundations` 下增加 Scaffold Context 类型和滚动状态契约。
- 实现带命名插槽、Shell 布局以及独立 FAB 定位层的 `RScaffold`。
- 实现或调整 `RContainer`，提供统一的最大宽度和两侧间距对齐。
- 通过插槽集成现有的 `RNavigationRail` 和 `RSideSheet`。
- 明确内外层 Scaffold 的布局、滚动、状态和 CSS 变量隔离。
- 增加根节点状态属性和 CSS 变量发布能力。

### 阶段 2：容器驱动的 Body

- 明确 Body 查询容器。
- 复用 `RGrid` 的容器响应值实现 4/8/12 列组合。
- 验证 Standard Side Sheet 展开后会改变 Body 宽度，并触发预期的网格切换。

### 阶段 3：滚动动态效果

- 增加活动滚动拥有者契约和通过 rAF 合并的滚动采样。
- 实现栏位隐藏/显示阈值和减少动态效果支持。
- 增加折叠 TopBar 进度和只使用 Transform 的标题插值。

### 阶段 4：Hero 与 FAB 定位

- 增加 Hero 重叠状态和圆角插值。
- 为 `#fab` 插槽增加独立层级、定位上下文和嵌套隔离。
- 为 `RFab` 提供 Hero 接缝定位所需的 CSS 变量约定，不计算运行时坐标。

### 阶段 5：响应式 Navigation 与验证

- 在现有原语不足时，增加 Standard Drawer 和 Modal Drawer 组合。
- 验证 RTL、Safe Area、键盘导航、嵌套使用、减少动态效果和 Modal 堆叠。
- 为所有骨架模式和 Side Sheet 状态切换增加视觉回归用例。

## 10. 验收矩阵

只有完成以下场景后，Scaffold 实现才算完成。

### 几何布局

- 没有挂载任何可选区域；
- 同时挂载 TopBar 和 BottomBar；
- Standard Side Sheet 打开和关闭；
- 持久化 Navigation 与 Standard Side Sheet 同时存在；
- Side Sheet 宽度接近 Body 可用的最小宽度；
- 区域挂载或过渡期间发生窗口调整；
- 存在 Safe Area Inset。

### 交互行为

- 向下滚动超过隐藏阈值；
- 在页面顶部、中部和底部向上滚动达到显示阈值；
- 两端发生过度滚动；
- 折叠栏进度为 0、0.5 和 1；
- Hero 重叠在 Body 到达 TopBar 边界前后；
- 接缝 FAB 在退场过渡两端的焦点和可见性。

### 可访问性

- 仅使用键盘导航；
- 屏幕阅读器地标顺序；
- Modal Side Sheet 的焦点锁定和焦点返回；
- Escape 和 Scrim 关闭；
- RTL 下的 Start/End 布局；
- `prefers-reduced-motion: reduce`。

### 性能

- Scroll Handler 不在同一循环中同步读写布局；
- 动画属性适合合成器处理；
- Scaffold 调整尺寸不会造成 Body 布局跳动；
- 嵌套 Scaffold 不会重复监听同一个滚动容器；
- 内外层 FAB 定位层不会互相覆盖。

## 11. 非目标与延后决策

第一版 Scaffold 不包含：

- 应用路由或路由过渡；
- 全局状态管理器；
- 页面级自动虚拟化；
- 任意多列 Dashboard 编排；
- Modal、焦点或 Overlay Stack foundation 的替代实现；
- 从整个组件库中移除视口断点。

仓库已经同时支持视口响应值和容器响应值。Scaffold 默认优先使用 Container Query 处理 Body 组合；其他组件仍可在自身契约需要时继续使用视口断点。

在进入实现前需要确定以下事项：

1. 公共 API 只采用插槽，还是同时提供显式的区域组件。
2. Body 滚动拥有者是否始终是当前 Scaffold Body，还是允许通过 Prop 指定。
3. Navigation 形态默认自动选择，还是默认要求显式指定。
4. `RContainer` 应作为公共组件，还是仅作为内部 foundation 原语。
5. `#fab` 插槽的默认定位模式，以及 Hero CSS 变量的最终命名。
6. 最终 Motion 时长和缓动 Token，待视觉评审后确定。

## 12. 完成标准

基于本方案实现的 Scaffold 必须：

- `RAppBar` 可以选择 `full-width`、`centered` 或 `body` 内容对齐模式；
- `RAppBar` 支持独立的 `collapsing` 和 `hide-on-scroll` 状态，并可同时启用；
- `vertical` 是当前唯一实现的滚动方向；
- `horizontal` 只提供 API，不实现横向滚动状态机；
- `none` 不自动驱动 AppBar 的滚动隐藏、折叠或 Hero 进度；
- `app-bar-seam` FAB 要求所属 `RAppBar` 保持展开，不与 `collapsing` 同时启用；
- 为 `#fab` 插槽提供独立且稳定的定位层；
- TopBar、BottomNavigation 和 Side Sheet 隐藏或显示时保持 Body 布局稳定；
- 通过 Body 的容器宽度，使内容网格能够从 4 列适配到 8 列和 12 列；
- 允许 Standard Side Sheet 收缩 Body，而不在 Controller 中编写基于视口的分支；
- 支持 Standard、Modal、Collapsing、Hero 和 Rail 等组合模式，并且不重复实现区域逻辑；
- 保持语义地标、焦点行为、RTL 布局、Safe Area 处理和减少动态效果支持；
- 除仓库规定的生成式文档 Stub 外，不产生未完成的 API 文档。
