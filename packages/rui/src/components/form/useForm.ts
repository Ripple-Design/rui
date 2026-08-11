import { computed, reactive, ref, watch } from "vue"

import {
    deepClone,
    getAtPath,
    isEmptyValue,
    normalizePath,
    replaceRecord,
    setAtPath,
} from "./path"
import type {
    RFormController,
    RFormDeepPartial,
    RFormFieldState,
    RFormFieldRegistrationOptions,
    RFormPath,
    RFormPathValue,
    RFormRule,
    RFormRules,
    RFormValidateTrigger,
    RFormValidationError,
    RFormValues,
    UseFormReturn,
} from "./types"

type RuntimeRule<TValues extends RFormValues> = RFormRule<unknown, TValues>
type RuntimeRules<TValues extends RFormValues> = Record<string, RuntimeRule<TValues>[]>
type InternalValidationTrigger = RFormValidateTrigger | "dependency"

function flattenRules<TValues extends RFormValues>(
    rules: RFormRules<TValues>,
    prefix = "",
    target: RuntimeRules<TValues> = {},
): RuntimeRules<TValues> {
    for (const [key, value] of Object.entries(rules)) {
        const path = normalizePath(prefix ? `${prefix}.${key}` : key)
        if (Array.isArray(value)) {
            target[path] = value as RuntimeRule<TValues>[]
            continue
        }

        if (value && typeof value === "object") {
            flattenRules(value as RFormRules<TValues>, path, target)
        }
    }

    return target
}

function createFieldState(): RFormFieldState {
    return {
        dirty: false,
        errors: [],
        invalid: false,
        pending: false,
        touched: false,
        valid: true,
        validated: false,
    }
}

function hasTrigger<TValues extends RFormValues>(rule: RuntimeRule<TValues>, trigger: InternalValidationTrigger) {
    if (trigger === "dependency" || trigger === "submit") {
        return true
    }

    const configuredTrigger = rule.trigger ?? "blur"
    const triggers = Array.isArray(configuredTrigger) ? configuredTrigger : [configuredTrigger]
    return triggers.includes(trigger)
}

function getLengthOrNumber(value: unknown) {
    if (typeof value === "number") {
        return value
    }

    if (typeof value === "string" || Array.isArray(value)) {
        return value.length
    }

    return null
}

function matchesType(value: unknown, type: NonNullable<RuntimeRule<RFormValues>["type"]>) {
    switch (type) {
        case "array":
            return Array.isArray(value)
        case "boolean":
            return typeof value === "boolean"
        case "email":
            return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        case "number":
            return typeof value === "number" && Number.isFinite(value)
        case "string":
            return typeof value === "string"
        case "url":
            if (typeof value !== "string") {
                return false
            }

            try {
                new URL(value)
                return true
            } catch {
                return false
            }
    }
}

function getRuleMessage<TValues extends RFormValues>(rule: RuntimeRule<TValues>) {
    if (rule.message == null) {
        return "Invalid value"
    }

    if (typeof rule.message !== "string") {
        throw new TypeError("RForm rule messages must be strings.")
    }

    return rule.message
}

function clearFieldValidation(state: RFormFieldState) {
    state.errors.splice(0)
    state.pending = false
    state.invalid = false
    state.valid = true
    state.validated = false
}

/**
 * Creates a reactive, rule-driven form controller.
 *
 * @param rules - Nested validation rules for a form without an initial snapshot.
 */
export function useForm<TValues extends RFormValues>(rules: RFormRules<TValues>): UseFormReturn<TValues>
/**
 * Creates a reactive, rule-driven form controller with an initial snapshot.
 *
 * @param initial - Initial values restored by {@link RFormController.reset}.
 * @param rules - Nested validation rules for the form.
 */
export function useForm<TValues extends RFormValues>(
    initial: RFormDeepPartial<TValues>,
    rules: RFormRules<TValues>,
): UseFormReturn<TValues>
export function useForm<TValues extends RFormValues>(
    initialOrRules: RFormDeepPartial<TValues> | RFormRules<TValues>,
    suppliedRules?: RFormRules<TValues>,
): UseFormReturn<TValues> {
    const rules = suppliedRules ?? (initialOrRules as RFormRules<TValues>)
    const initial = suppliedRules ? (initialOrRules as RFormDeepPartial<TValues>) : {}
    const flatRules = flattenRules(rules)
    const initialSnapshot = deepClone(initial) as Record<string, unknown>

    for (const path of Object.keys(flatRules)) {
        if (getAtPath(initialSnapshot, path) === undefined) {
            setAtPath(initialSnapshot, path, undefined)
        }
    }

    const value = reactive(deepClone(initialSnapshot)) as TValues
    const fields = reactive<Record<string, RFormFieldState>>({})
    const validationGenerations = new Map<string, number>()
    const ruleResults = new Map<string, Map<RuntimeRule<TValues>, RFormValidationError | null>>()
    const dependents = new Map<string, Set<string>>()
    const ignoredRequiredPaths = new Set<string>()
    const submitted = ref(false)
    let isResetting = false

    for (const [path, rulesForPath] of Object.entries(flatRules)) {
        fields[path] = createFieldState()

        for (const rule of rulesForPath) {
            const dependencies = new Set<string>(rule.dependsOn?.map(normalizePath))
            if (rule.sameAs) {
                dependencies.add(normalizePath(rule.sameAs))
            }

            for (const dependency of dependencies) {
                const fieldDependents = dependents.get(dependency) ?? new Set<string>()
                fieldDependents.add(path)
                dependents.set(dependency, fieldDependents)
            }
        }
    }

    function getField(path: string) {
        const normalizedPath = normalizePath(path)
        const existing = fields[normalizedPath]
        if (existing) {
            return existing
        }

        const state = createFieldState()
        fields[normalizedPath] = state
        return state
    }

    function clearRuleResults(path: string) {
        ruleResults.delete(normalizePath(path))
    }

    function getFirstRuleError(path: string) {
        const normalizedPath = normalizePath(path)
        const results = ruleResults.get(normalizedPath)
        if (!results) {
            return null
        }

        for (const rule of flatRules[normalizedPath] ?? []) {
            if (ignoredRequiredPaths.has(normalizedPath) && rule.required) {
                continue
            }

            const error = results.get(rule)
            if (error) {
                return error
            }
        }

        return null
    }

    async function validateRule(
        rule: RuntimeRule<TValues>,
        fieldValue: unknown,
    ): Promise<RFormValidationError | null> {
        if (rule.required && (fieldValue === false || isEmptyValue(fieldValue))) {
            return {
                message: getRuleMessage(rule),
                rule: rule as RFormRule<unknown, any>,
            }
        }

        if (isEmptyValue(fieldValue)) {
            return null
        }

        if (rule.type && !matchesType(fieldValue, rule.type)) {
            return {
                message: getRuleMessage(rule),
                rule: rule as RFormRule<unknown, any>,
            }
        }

        const lengthOrNumber = getLengthOrNumber(fieldValue)
        if (rule.min != null && (lengthOrNumber == null || lengthOrNumber < rule.min)) {
            return {
                message: getRuleMessage(rule),
                rule: rule as RFormRule<unknown, any>,
            }
        }

        if (rule.max != null && (lengthOrNumber == null || lengthOrNumber > rule.max)) {
            return {
                message: getRuleMessage(rule),
                rule: rule as RFormRule<unknown, any>,
            }
        }

        if (rule.len != null && (lengthOrNumber == null || lengthOrNumber !== rule.len)) {
            return {
                message: getRuleMessage(rule),
                rule: rule as RFormRule<unknown, any>,
            }
        }

        if (rule.pattern) {
            rule.pattern.lastIndex = 0
            if (typeof fieldValue !== "string" || !rule.pattern.test(fieldValue)) {
                return {
                    message: getRuleMessage(rule),
                    rule: rule as RFormRule<unknown, any>,
                }
            }
        }

        if (rule.sameAs && !Object.is(fieldValue, getAtPath(value, rule.sameAs))) {
            return {
                message: getRuleMessage(rule),
                rule: rule as RFormRule<unknown, any>,
            }
        }

        if (rule.validator) {
            try {
                const valid = await rule.validator(fieldValue, value)
                if (!valid) {
                    return {
                        message: getRuleMessage(rule),
                        rule: rule as RFormRule<unknown, any>,
                    }
                }
            } catch {
                return {
                    message: getRuleMessage(rule),
                    rule: rule as RFormRule<unknown, any>,
                }
            }
        }

        return null
    }

    async function validatePath(path: string, trigger: InternalValidationTrigger) {
        const normalizedPath = normalizePath(path)
        const state = getField(normalizedPath)
        const rulesForPath = flatRules[normalizedPath] ?? []
        const applicableRules = rulesForPath.filter(
            (rule) => hasTrigger(rule, trigger) && !(ignoredRequiredPaths.has(normalizedPath) && rule.required),
        )

        if (applicableRules.length === 0) {
            return state.valid
        }

        const generation = (validationGenerations.get(normalizedPath) ?? 0) + 1
        validationGenerations.set(normalizedPath, generation)
        state.pending = true

        const fieldValue = getAtPath(value, normalizedPath)
        const results = ruleResults.get(normalizedPath) ?? new Map<RuntimeRule<TValues>, RFormValidationError | null>()
        ruleResults.set(normalizedPath, results)

        for (const rule of applicableRules) {
            const error = await validateRule(rule, fieldValue)
            if (validationGenerations.get(normalizedPath) !== generation) {
                return state.valid
            }

            results.set(rule, error)
            if (error) {
                break
            }
        }

        const firstError = getFirstRuleError(normalizedPath)
        state.pending = false
        state.validated = true
        state.valid = firstError == null
        state.invalid = firstError != null
        state.errors.splice(0, state.errors.length, ...(firstError ? [firstError] : []))

        return state.valid
    }

    function revalidateDependents(path: string) {
        for (const dependentPath of dependents.get(path) ?? []) {
            const state = getField(dependentPath)
            if (!state.touched && !state.validated) {
                continue
            }

            void validatePath(dependentPath, "dependency")
        }
    }

    const watchedPaths = new Set([...Object.keys(flatRules), ...dependents.keys()])

    for (const path of watchedPaths) {
        watch(
            () => getAtPath(value, path),
            () => {
                if (isResetting) {
                    return
                }

                cancelValidation(path)
                clearRuleResults(path)

                if (flatRules[path]) {
                    const state = getField(path)
                    state.dirty = true
                }

                revalidateDependents(path)
            },
            { deep: true, flush: "sync" },
        )
    }

    const valid = computed(() => Object.values(fields).every((field) => field.valid))
    const pending = computed(() => Object.values(fields).some((field) => field.pending))
    const dirty = computed(() => Object.values(fields).some((field) => field.dirty))
    const touched = computed(() => Object.values(fields).some((field) => field.touched))

    function cancelValidation(path: string) {
        const normalizedPath = normalizePath(path)
        validationGenerations.set(normalizedPath, (validationGenerations.get(normalizedPath) ?? 0) + 1)
    }

    function clearValidate() {
        for (const [path, state] of Object.entries(fields)) {
            cancelValidation(path)
            clearRuleResults(path)
            clearFieldValidation(state)
        }
    }

    function clearValidateField<TPath extends RFormPath<TValues>>(path: TPath) {
        const normalizedPath = normalizePath(path)
        cancelValidation(normalizedPath)
        clearRuleResults(normalizedPath)
        clearFieldValidation(getField(normalizedPath))
    }

    function getFieldState<TPath extends RFormPath<TValues>>(path: TPath) {
        return getField(path)
    }

    function getValue<TPath extends RFormPath<TValues>>(path: TPath) {
        return getAtPath(value, path) as RFormPathValue<TValues, TPath>
    }

    function isFieldRequired<TPath extends RFormPath<TValues>>(path: TPath) {
        const normalizedPath = normalizePath(path)
        return !ignoredRequiredPaths.has(normalizedPath) && (flatRules[normalizedPath] ?? []).some((rule) => rule.required === true)
    }

    function registerField<TPath extends RFormPath<TValues>>(
        path: TPath,
        defaultValue: RFormPathValue<TValues, TPath>,
        options: RFormFieldRegistrationOptions = {},
    ) {
        const normalizedPath = normalizePath(path)
        const ignoresRequired = options.ignoreRequired && (flatRules[normalizedPath] ?? []).some((rule) => rule.required)
        if (ignoresRequired && !ignoredRequiredPaths.has(normalizedPath)) {
            ignoredRequiredPaths.add(normalizedPath)
            clearRuleResults(normalizedPath)
            clearFieldValidation(getField(normalizedPath))
            console.warn(`RForm ignores required rules for field "${normalizedPath}".`)
        }

        getField(normalizedPath)

        const existingValue = getAtPath(value, normalizedPath)
        if (existingValue !== undefined && (!options.replaceNullish || existingValue != null)) {
            return
        }

        isResetting = true
        setAtPath(initialSnapshot, normalizedPath, deepClone(defaultValue))
        setAtPath(value as Record<string, unknown>, normalizedPath, deepClone(defaultValue))
        isResetting = false
    }

    function markSubmitted() {
        submitted.value = true
        for (const state of Object.values(fields)) {
            state.touched = true
        }
    }

    function reset() {
        isResetting = true
        replaceRecord(value as Record<string, unknown>, initialSnapshot)
        isResetting = false
        submitted.value = false

        for (const [path, state] of Object.entries(fields)) {
            cancelValidation(path)
            clearRuleResults(path)
            state.dirty = false
            state.touched = false
            clearFieldValidation(state)
        }
    }

    function resetField<TPath extends RFormPath<TValues>>(path: TPath) {
        const normalizedPath = normalizePath(path)
        cancelValidation(normalizedPath)
        clearRuleResults(normalizedPath)
        isResetting = true
        setAtPath(value as Record<string, unknown>, normalizedPath, deepClone(getAtPath(initialSnapshot, normalizedPath)))
        isResetting = false

        const state = getField(normalizedPath)
        state.dirty = false
        state.touched = false
        clearFieldValidation(state)
    }

    function setTouched<TPath extends RFormPath<TValues>>(path: TPath, isTouched = true) {
        getField(path).touched = isTouched
    }

    function setValue<TPath extends RFormPath<TValues>>(
        path: TPath,
        fieldValue: RFormPathValue<TValues, TPath>,
    ) {
        const normalizedPath = normalizePath(path)
        setAtPath(value as Record<string, unknown>, normalizedPath, fieldValue)
        getField(normalizedPath).dirty = true
    }

    async function validate() {
        const results = await Promise.all(Object.keys(flatRules).map((path) => validatePath(path, "submit")))
        return results.every(Boolean)
    }

    function validateField<TPath extends RFormPath<TValues>>(
        path: TPath,
        trigger: RFormValidateTrigger = "blur",
    ) {
        return validatePath(path, trigger)
    }

    const form = reactive({
        get dirty() {
            return dirty.value
        },
        fields,
        get invalid() {
            return !valid.value
        },
        get pending() {
            return pending.value
        },
        get submitted() {
            return submitted.value
        },
        get touched() {
            return touched.value
        },
        get valid() {
            return valid.value
        },
        value,
        clearValidate,
        clearValidateField,
        getFieldState,
        getValue,
        isFieldRequired,
        markSubmitted,
        registerField,
        reset,
        resetField,
        setTouched,
        setValue,
        validate,
        validateField,
    }) as RFormController<TValues>

    return { form, value }
}
