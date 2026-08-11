# RForm Design

## Scope

RForm is a reactive, rule-driven form system for RUI.

- `useForm()` owns form values, validation, and field state.
- `RForm` renders the native `<form>`, handles submission, and provides field context.
- Form-aware controls bind through a `name` path.
- Controls remain usable without RForm through their ordinary `v-model` API.

The public API is configuration-based. It does not expose `FormControl` trees as the normal usage model.

## Creating a Form

`useForm` has two overloads:

```ts
function useForm<TValue>(rules: RFormRules<TValue>): UseFormReturn<TValue>

function useForm<TValue>(
  initial: DeepPartial<TValue>,
  rules: RFormRules<TValue>,
): UseFormReturn<TValue>
```

Create forms without initial values by declaring the value type inline:

```ts
const { form, value } = useForm<{
  account: {
    email: string
    password: string
    confirmPassword: string
  }
  agreement: boolean
}>({
  account: {
    email: [
      { required: true, message: 'Please input email' },
      { type: 'email', message: 'Please input a valid email address' },
    ],
    password: [
      { required: true, message: 'Please input password' },
      { min: 8, message: 'Password must contain at least 8 characters' },
    ],
    confirmPassword: [
      { required: true, message: 'Please confirm password' },
      { sameAs: 'account.password', message: 'Passwords do not match' },
    ],
  },
  agreement: [
    { required: true, message: 'You must accept the terms' },
  ],
})
```

Pass an `initial` snapshot only for editing, prefilling, or reset behavior:

```ts
const { form, value } = useForm(
  {
    account: {
      email: user.email,
      password: '',
      confirmPassword: '',
    },
    agreement: user.agreement,
  },
  {
    account: {
      email: [
        { required: true, message: 'Please input email' },
        { type: 'email', message: 'Please input a valid email address' },
      ],
      password: [
        { min: 8, message: 'Password must contain at least 8 characters' },
      ],
      confirmPassword: [
        { sameAs: 'account.password', message: 'Passwords do not match' },
      ],
    },
  },
)
```

`initial` is a snapshot. It is not a continuously synchronized external value source. `form.reset()` restores this snapshot.

When no initial value exists, a registered control supplies its own normal default value. For example, a text field supplies `''`, a checkbox supplies `false`, a multi-select control supplies `[]`, and a select control may supply `undefined`.

## Form Value and State

`useForm()` returns an object that supports safe destructuring:

```ts
const { form, value } = useForm(...)
```

`value` is a stable reactive object, not a `Ref`:

```ts
value.account.email = 'rui@example.com'

form.value === value
```

Reset must patch the existing reactive value tree rather than replace it, so destructured `value` remains valid.

The form controller exposes reactive state and operations:

```ts
interface RFormInstance<TValue> {
  readonly value: TValue

  readonly valid: boolean
  readonly invalid: boolean
  readonly pending: boolean
  readonly submitted: boolean
  readonly dirty: boolean
  readonly touched: boolean

  validate(): Promise<boolean>
  validateField(path: RFormPath<TValue>): Promise<boolean>

  reset(): void
  resetField(path: RFormPath<TValue>): void

  clearValidate(): void
  clearValidateField(path: RFormPath<TValue>): void

  setValue<TPath extends RFormPath<TValue>>(
    path: TPath,
    value: RFormPathValue<TValue, TPath>,
  ): void

  getValue<TPath extends RFormPath<TValue>>(
    path: TPath,
  ): RFormPathValue<TValue, TPath>
}
```

## RForm and Field Binding

`RForm` receives the controller. Fields resolve their rule and value by `name` from the nearest RForm context.

```vue
<RForm
  :form
  required-indicator="label-asterisk"
  @submit="handleSubmit"
  @invalid-submit="handleInvalidSubmit"
>
  <RTextField
    name="account.email"
    label="Email"
    autocomplete="email"
  />

  <RTextField
    name="account.password"
    label="Password"
    type="password"
    autocomplete="new-password"
  />

  <RTextField
    name="account.confirmPassword"
    label="Confirm password"
    type="password"
  />

  <RCheckbox
    name="agreement"
    label="I agree to the terms"
  />

  <RButton type="submit">Create account</RButton>
</RForm>
```

`RForm` renders a real `<form>` and:

1. intercepts native form submission;
2. validates every field, including asynchronous rules;
3. marks invalid fields as touched;
4. emits `submit` only if valid;
5. emits `invalid-submit` if validation fails;
6. may focus the first focusable invalid field.

A submitted event carries the reactive form value:

```ts
interface RFormSubmitEvent<TValue> {
  value: TValue
  form: RFormInstance<TValue>
  nativeEvent: SubmitEvent
}
```

The first version does not include an `RFormError` component. Field components display their own validation state through their existing error and supporting-text UI.

## Rule Model

Rules are nested to mirror the form value shape. Fields use dot paths only in templates and dependency references.

```ts
interface RFormRule<TFieldValue, TFormValue> {
  required?: boolean

  type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'array'
    | 'email'
    | 'url'

  min?: number
  max?: number
  len?: number
  pattern?: RegExp

  sameAs?: RFormPath<TFormValue>
  dependsOn?: RFormPath<TFormValue>[]

  message?: string

  trigger?: RFormValidateTrigger | RFormValidateTrigger[]

  validator?: RFormValidator<TFieldValue, TFormValue>
}

type RFormValidateTrigger =
  | 'input'
  | 'change'
  | 'blur'
  | 'submit'

type RFormValidator<TFieldValue, TFormValue> = (
  fieldValue: TFieldValue,
  values: Readonly<TFormValue>,
) => boolean | Promise<boolean>
```

Simple rules should remain on one line. Use multiline objects only where a custom validator or several dependencies make it necessary.

```ts
email: [
  { required: true, message: 'Please input email' },
  { type: 'email', message: 'Please input a valid email address' },
]
```

Rules run in order. The first failed rule supplies the field error. A failed `required` rule stops later format, length, and pattern rules for that field.

## Validation Timing

A rule without an explicit trigger defaults to `blur`:

```ts
{ required: true, message: 'Please input email' }
```

is equivalent to:

```ts
{ required: true, message: 'Please input email', trigger: 'blur' }
```

Override the default only when necessary:

```ts
{ min: 8, message: 'Password must contain at least 8 characters', trigger: ['input', 'blur'] }
```

```ts
{ required: true, message: 'Please select a country', trigger: 'change' }
```

Native form submission validates every rule regardless of its trigger.

Validation state and error visibility are separate. An invalid field shows an error only after it has been touched or after the form has been submitted:

```ts
showError = field.invalid && (field.touched || form.submitted)
```

This prevents untouched fields from displaying errors on the initial render.

## Cross-Field Validation

Use `sameAs` for matching values. It automatically records the referenced field as a dependency.

```ts
confirmPassword: [
  { required: true, message: 'Please confirm password' },
  { sameAs: 'account.password', message: 'Passwords do not match' },
]
```

When `account.password` changes, the confirm-password rule is revalidated. If the confirmation field has been touched or the form was submitted, its visible error updates immediately.

For more complex cross-field rules, use `validator` with explicit dependencies:

```ts
endDate: [
  { required: true, message: 'Please select an end date' },
  {
    dependsOn: ['account.startDate'],
    validator(endDate, values) {
      return endDate >= values.account.startDate
    },
    message: 'End date must be after start date',
  },
]
```

The validator parameters have fixed meaning:

```ts
validator(fieldValue, values)
```

- `fieldValue` is the value of the field owning the rule.
- `values` is the complete form value tree.

Validators return only `boolean` or `Promise<boolean>`. The rule's `message` remains the single source of error text.

## Required Indicators

Required/optional indicators are a presentation concern of `RForm`, not a `useForm()` concern.

```ts
type RFormRequiredIndicator =
  | 'helper-required'
  | 'label-asterisk'
  | 'label-optional'
```

```vue
<RForm :form required-indicator="label-asterisk">
  <!-- fields -->
</RForm>
```

| Value | Required field | Optional field |
| --- | --- | --- |
| `helper-required` | Helper text shows `* Required` | No indicator |
| `label-asterisk` | Label ends with `*` | No indicator |
| `label-optional` | No indicator | Label ends with `(Optional)` |
| omitted | No indicator | No indicator |

A field is required only when its active rules contain `required: true`. With `helper-required`, a validation error takes precedence over the generated required helper text.

## Optional Future Scope

The first version focuses on regular named fields, nested object paths, built-in validation, asynchronous validators, and cross-field dependencies.

Potential later additions include:

- `RFormGroup` for shortening deeply nested template paths;
- form arrays and repeated fields;
- form-level validation and error summaries;
- server-side error mapping;
- richer custom validation messages and localization hooks.
