---
title: Text Field API
routeSlug: text-field
locale: en
docs: /en/components/text-field/spec
designOrder: 100
developOrder: 20
---

<!-- AUTO-GENERATED:START -->

## Import

```ts
import { RTextField } from "@ripple-design/rui"
```

## Props

| Name          | Type                       | Default   | Required | Description                                                                    |
| ------------- | -------------------------- | --------- | -------- | ------------------------------------------------------------------------------ |
| `errorText`   | `MaybeRef<string \| null>` | —         | no       | Displays an error message below the field control.                             |
| `label`       | `string`                   | —         | no       | Sets the visible field label.                                                  |
| `textArea`    | `boolean`                  | —         | no       | Renders a multiline textarea instead of a single-line input.                   |
| `placeholder` | `string`                   | —         | no       | Sets the placeholder text shown when the field is empty.                       |
| `startIcon`   | `RIconResolvableSource`    | —         | no       | Renders a decorative icon at the logical inline start of the field.            |
| `endIcon`     | `RIconResolvableSource`    | —         | no       | Renders a decorative icon at the logical inline end of the field.              |
| `clearable`   | `boolean`                  | `false`   | no       | Shows an end action that clears the field while it is focused and has a value. |
| `clearLabel`  | `string`                   | `"Clear"` | no       | Sets the accessible name announced for the clear action.                       |

## Events

| Name                | Parameters      | Description                           |
| ------------------- | --------------- | ------------------------------------- |
| `update:modelValue` | `value: string` | Emitted when the model value changes. |

Generated from `../../../../../../packages/rui/src/components/input/textField/types.ts` and `../../../../../../packages/rui/src/components/input/textField/RTextField.vue`.

<!-- AUTO-GENERATED:END -->
