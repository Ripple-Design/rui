# App Bar M2 Alignment Checklist

> Scope: compare RUI `RTopAppBar` / `RScaffold` only with Material Components Android Material 2 (`AppBarLayout`, `MaterialToolbar`, and `CollapsingToolbarLayout`).
>
> Mark an item complete only after implementation and targeted regression coverage are in place.

## Foundation and default geometry

- [x] **Use the M2 phone Toolbar baseline of 56px.**
    - Current: `collapsedHeight` defaults to `64px`.
    - Target: default to the M2 `mtrl_toolbar_default_height` phone baseline of `56px`; use the existing `clg` container breakpoint (`720px`) for the `64px` large-screen value, or allow an explicit override.
    - RUI: `packages/rui/src/components/appBar/types.ts`, `packages/rui/src/components/appBar/RTopAppBar.vue`
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/res/values/dimens.xml`, `res/values-sw600dp/dimens.xml`

- [x] **Give collapsing bars a nonzero default collapse distance.**
    - Current: an omitted `expandedHeight` resolves to `collapsedHeight`, so `collapsing` can have no visible effect.
    - Target: define an expanded geometry for collapsing bars, or require a valid expanded height through the type/API design.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`

- [x] **Add app-bar-specific geometry tokens.**
    - Target: move component geometry, padding, title margins, and toolbar control sizing out of generic layout values into `--rui-comp-app-bar-*` tokens.
    - Current: the root content geometry is generic flex spacing and padding.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`

## App Bar surface and lift state

- [x] **Implement M2 liftable and lifted states.**
    - Current: `RSurface` is always rendered at elevation 4.
    - Target: use elevation 0 while liftable but not lifted; switch to elevation 4 when the scroll target can scroll upward / has left the top.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`, `packages/rui/src/components/scaffold/RScaffold.vue`
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/AppBarLayout.java`

- [x] **Match M2 lift elevation timing.**
    - Current: generic elevation transitions use 280ms.
    - Target: use the M2 app-bar state animator duration of 150ms for lifted elevation changes.
    - RUI: `packages/rui/src/styles/elevations.scss`
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/res/values/integers.xml`, `res/animator-v21/design_appbar_state_list_animator.xml`

- [x] **Support M2 Primary and Surface toolbar treatments.**
    - Current: every app bar is a generic elevated `RSurface`.
    - Target: provide app-bar-specific primary and surface visual treatments, including appropriate background, foreground, and elevation defaults.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/res/values/styles.xml`

- [x] **Separate Toolbar content from App Bar decoration.**
    - `RTopAppBar` is transparent and square; `RAppBarContainer` owns Scaffold background, elevation, sticky positioning, and hide/collapse presentation.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`, `packages/rui/src/components/appBar/RAppBarContainer.vue`, `packages/rui/src/components/scaffold/RScaffold.vue`

## Scroll ranges and app-bar behavior

- [x] **Replace the fixed 48px collapse threshold.**
    - Current: `scrollTop > 48` flips a binary collapsed state.
    - Target: derive the collapse range from expanded height, collapsed height, and top inset.
    - RUI: `packages/rui/src/components/scaffold/RScaffold.vue`
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/AppBarLayout.java`

- [x] **Publish continuous collapse progress.**
    - Current: `--rui-sys-scaffold-collapse-progress` is only `0` or `1`.
    - Target: publish a clamped continuous progress value based on the actual collapse range, for example `scrollOffset / collapseDistance`.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`, `packages/rui/src/components/scaffold/RScaffold.vue`

- [ ] **Define M2-equivalent scroll behavior options.**
    - Target: support a web-appropriate equivalent for `scroll`, `exitUntilCollapsed`, `enterAlways`, `enterAlwaysCollapsed`, `snap`, and `snapMargins`; preserve an explicit no-scroll/fixed mode.
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/res/values/attrs.xml`

- [ ] **Implement scroll-end snap for collapsible bars.**
    - Current: there is no settle behavior.
    - Target: settle to the correct expanded or collapsed edge when scrolling ends, with a decelerated offset animation whose duration accounts for distance and velocity.
    - RUI: `packages/rui/src/components/scaffold/RScaffold.vue`
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/AppBarLayout.java`

- [x] **Sample scrolling once per animation frame.**
    - Current: scroll state updates directly from every native scroll event.
    - Target: coalesce visual state calculation with `requestAnimationFrame` while preserving the latest scroll position.
    - RUI: `packages/rui/src/components/scaffold/RScaffold.vue`

- [ ] **Resolve collapsing and hide-on-scroll ordering.**
    - Current: a qualifying downward scroll hides the app bar before collapse is evaluated; a hidden bar then skips collapse updates.
    - Target: specify and implement scroll-range consumption so the bar collapses before any whole-bar hide behavior, where both modes are enabled.
    - RUI: `packages/rui/src/components/scaffold/RScaffold.vue`

## Collapsing toolbar

- [x] **Add an explicit collapsing title model.**
    - Target: support title enabled state, expanded and collapsed title bounds, gravity, and margins instead of leaving all title behavior in an opaque default slot.
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/CollapsingToolbarLayout.java`, `res/values/attrs.xml`

- [x] **Add expanded and collapsed title text appearances.**
    - Target: provide separate typography/style contracts for both title states, including color and RTL-aware positioning.
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/CollapsingToolbarLayout.java`, `res/values/attrs.xml`

- [x] **Drive title transition from continuous collapse progress.**
    - Current: no consumer reads the binary collapse progress variable.
    - Target: title position, scale/opacity, and bounds update continuously during the scroll-driven collapse.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`

- [x] **Add child pin behavior.**
    - Target: allow designated app-bar children to remain pinned while the surrounding expanded region collapses.
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/CollapsingToolbarLayout.java`

- [x] **Add child parallax behavior.**
    - Target: allow designated app-bar children to translate with a configurable parallax multiplier; M2 defaults to 0.5.
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/CollapsingToolbarLayout.java`

- [x] **Evaluate the M2 compress scroll effect.**
    - Target: decide whether to expose a web equivalent of M2 `scrollEffect="compress"`; if adopted, include clipping and configurable/default compression behavior.
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/AppBarLayout.java`, `res/values/attrs.xml`

## Toolbar structure and content layout

- [x] **Define navigation, title, subtitle, and actions regions.**
    - Current: the app bar exposes only one default slot.
    - Target: add named slots or first-party child components with an explicit structural contract.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`

- [x] **Implement M2 title and subtitle layout behavior.**
    - Target: title/subtitle margins, truncation, baseline handling, RTL support, and collisions with navigation/actions should be handled by the app bar layout.
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/MaterialToolbar.java`

- [x] **Add centered-title behavior independent of content alignment.**
    - Current: `contentAlign="centered"` centers the content container, not the title.
    - Target: center title/subtitle within the app bar only when they can avoid leading/trailing controls, and constrain them otherwise.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/MaterialToolbar.java`

- [x] **Define M2-style foreground hierarchy.**
    - Target: set App Bar title, subtitle, navigation icon, and action/overflow colors through `--rui-comp-app-bar-*` tokens rather than inherited arbitrary slot content.
    - M2: `material-components-android/lib/java/com/google/android/material/appbar/res/values/styles.xml`

## RUI-specific correctness and accessibility

- [ ] **Implement or remove the inert `underlap` prop.**
    - Current: the prop only adds `rui-app-bar--underlap`; no matching CSS or Scaffold layer behavior exists.
    - Target: implement the documented underlap layering contract, including a body-underlap layer and a background/scrim layer above it, or remove the public prop.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`, `packages/rui/src/components/scaffold/RScaffold.vue`, `SCAFFOLD.md`

- [ ] **Keep an app-bar-seam FAB coherent with App Bar visibility.**
    - Current: a seam FAB suppresses collapse but not hide-on-scroll, so the bar and FAB can leave the viewport inconsistently.
    - Target: disable hide-on-scroll for that arrangement or define one synchronized App Bar/FAB hide policy.
    - RUI: `packages/rui/src/components/appBar/RTopAppBar.vue`, `packages/rui/src/components/scaffold/RScaffold.vue`

- [x] **Remove hidden App Bar controls from interaction and tab order.**
    - Current: hiding only translates the header offscreen.
    - Target: while hidden, disable pointer interaction and remove descendants from sequential focus; restore both when visible.
    - RUI: `packages/rui/src/components/scaffold/RScaffold.vue`

- [ ] **Provide an accessible App Bar landmark and labeling contract.**
    - Target: establish semantic app-bar navigation/toolbar labeling and ensure first-party navigation/action controls require accessible names.
