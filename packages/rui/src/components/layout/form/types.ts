/** Value types accepted by {@link useForm}. */
export type RFormValues = object

/** Recursively makes a form-value tree optional for initial snapshots. */
export type RFormDeepPartial<TValue> = TValue extends (...args: never[]) => unknown
    ? TValue
    : TValue extends readonly (infer TItem)[]
      ? RFormDeepPartial<TItem>[]
      : TValue extends object
        ? { [TKey in keyof TValue]?: RFormDeepPartial<TValue[TKey]> }
        : TValue

type RFormPathKey = string | number
type RFormPathDepth = readonly unknown[]
type RFormPathPrimitive = bigint | boolean | Date | null | number | string | symbol | undefined

type RFormPathInternal<TValue, TDepth extends RFormPathDepth> = TDepth["length"] extends 6
    ? string
    : TValue extends RFormPathPrimitive
      ? never
      : TValue extends readonly (infer TItem)[]
        ? `${number}` | `${number}.${RFormPathInternal<TItem, [...TDepth, unknown]>}`
        : TValue extends object
          ? {
                [TKey in Extract<keyof TValue, RFormPathKey>]: TValue[TKey] extends RFormPathPrimitive
                    ? `${TKey}`
                    : `${TKey}` | `${TKey}.${RFormPathInternal<TValue[TKey], [...TDepth, unknown]>}`
            }[Extract<keyof TValue, RFormPathKey>]
          : never

/** Dot-separated path to a value in a form tree. */
export type RFormPath<TValue> = string extends keyof TValue ? string : RFormPathInternal<TValue, []>

/** Resolves the value type at a dot-separated {@link RFormPath}. */
export type RFormPathValue<TValue, TPath extends string> = TPath extends `${infer THead}.${infer TTail}`
    ? THead extends keyof TValue
        ? RFormPathValue<TValue[THead], TTail>
        : TValue extends readonly (infer TItem)[]
          ? THead extends `${number}`
              ? RFormPathValue<TItem, TTail>
              : unknown
          : unknown
    : TPath extends keyof TValue
      ? TValue[TPath]
      : TValue extends readonly (infer TItem)[]
        ? TPath extends `${number}`
            ? TItem
            : unknown
        : unknown

/** Event that can cause a field rule to validate. */
export type RFormValidateTrigger = "blur" | "change" | "input" | "submit"

/** Built-in value type checks supported by a form rule. */
export type RFormRuleType = "array" | "boolean" | "email" | "number" | "string" | "url"

/** Runs custom validation for a field value against the complete form values. */
export type RFormValidator<TFieldValue, TValues> = (
    fieldValue: TFieldValue,
    values: Readonly<TValues>,
) => boolean | Promise<boolean>

/** Decides whether a rule is active for the current form values. */
export type RFormValidateWhen<TFieldValue, TValues> = (
    fieldValue: TFieldValue,
    values: Readonly<TValues>,
) => boolean

/** Declarative validation rule for a form field. */
export type RFormRule<TFieldValue = unknown, TValues = unknown> = {
    /** Requires a non-empty value. */
    required?: boolean
    /** Checks the value against a built-in type or format. */
    type?: RFormRuleType
    /** Sets the lower numeric bound or minimum string/array length. */
    min?: number
    /** Sets the upper numeric bound or maximum string/array length. */
    max?: number
    /** Requires an exact numeric value or string/array length. */
    len?: number
    /** Requires a string value to match this expression. */
    pattern?: RegExp
    /** Requires this field to equal the value at another form path. */
    sameAs?: RFormPath<TValues>
    /** Revalidates this field after one of these paths changes. */
    dependsOn?: readonly RFormPath<TValues>[]
    /** Decides whether this rule participates in validation. Dependencies read here must be declared in dependsOn. */
    validateWhen?: RFormValidateWhen<TFieldValue, TValues>
    /** Supplies custom synchronous or asynchronous validation. */
    validator?: RFormValidator<TFieldValue, TValues>
    /** Message shown when this rule is the first failed rule. */
    message?: string
    /** Chooses when this rule runs. Defaults to `blur`. */
    trigger?: RFormValidateTrigger | readonly RFormValidateTrigger[]
}

/** Nested form rule tree that mirrors the shape of its form values. */
export type RFormRules<TValues, TRootValues = TValues> = {
    [TKey in keyof TValues]?:
        | RFormRule<TValues[TKey], TRootValues>[]
        | (TValues[TKey] extends RFormPathPrimitive | readonly unknown[]
              ? never
              : TValues[TKey] extends object
                ? RFormRules<TValues[TKey], TRootValues>
                : never)
}

/** Error produced by the first failed rule for a field. */
export type RFormValidationError = {
    message: string
    rule: RFormRule<unknown, any>
}

/** Reactive validation and interaction state for one normalized field path. */
export type RFormFieldState = {
    dirty: boolean
    errors: RFormValidationError[]
    invalid: boolean
    pending: boolean
    touched: boolean
    valid: boolean
    validated: boolean
}

/** Preferred visual hint for fields with a `required` rule. */
export type RFormRequiredIndicator = "helper-required" | "label-asterisk" | "label-optional"

/** Result emitted by {@link RForm} after successful submission. */
export type RFormSubmitEvent<TValues extends RFormValues> = {
    form: RFormController<TValues>
    nativeEvent?: SubmitEvent
    value: TValues
}

/** Result emitted by {@link RForm} after failed submission. */
export type RFormInvalidSubmitEvent<TValues extends RFormValues> = {
    form: RFormController<TValues>
    nativeEvent?: SubmitEvent
}

/** Props accepted by the {@link RForm} component. */
export type RFormProps<TValues extends RFormValues> = {
    /** Form controller returned from {@link useForm}. */
    form: RFormController<TValues>
    /** Controls how required or optional fields are marked by future field adapters. */
    requiredIndicator?: RFormRequiredIndicator
}

export type RFormFieldRegistrationOptions = {
    /** Skips complete rules containing `required` for controls with their own required-selection semantics. */
    ignoreRequired?: boolean
    /** Replaces a nullish form value with the registered default and records it for reset. */
    replaceNullish?: boolean
}

/** Public reactive controller returned from {@link useForm}. */
export type RFormController<TValues extends RFormValues> = {
    readonly dirty: boolean
    readonly fields: Record<string, RFormFieldState>
    readonly invalid: boolean
    readonly pending: boolean
    readonly submitted: boolean
    readonly touched: boolean
    readonly valid: boolean
    readonly value: TValues

    clearValidate(): void
    clearValidateField<TPath extends RFormPath<TValues>>(path: TPath): void
    getFieldState<TPath extends RFormPath<TValues>>(path: TPath): RFormFieldState
    getValue<TPath extends RFormPath<TValues>>(path: TPath): RFormPathValue<TValues, TPath>
    isFieldRequired<TPath extends RFormPath<TValues>>(path: TPath): boolean
    markSubmitted(): void
    registerField<TPath extends RFormPath<TValues>>(
        path: TPath,
        defaultValue: RFormPathValue<TValues, TPath>,
        options?: RFormFieldRegistrationOptions,
    ): void
    reset(): void
    resetField<TPath extends RFormPath<TValues>>(path: TPath): void
    setTouched<TPath extends RFormPath<TValues>>(path: TPath, touched?: boolean): void
    setValue<TPath extends RFormPath<TValues>>(
        path: TPath,
        value: RFormPathValue<TValues, TPath>,
    ): void
    validate(): Promise<boolean>
    validateField<TPath extends RFormPath<TValues>>(
        path: TPath,
        trigger?: RFormValidateTrigger,
    ): Promise<boolean>
}

/** Return value of {@link useForm}. */
export type UseFormReturn<TValues extends RFormValues> = {
    form: RFormController<TValues>
    value: TValues
}
