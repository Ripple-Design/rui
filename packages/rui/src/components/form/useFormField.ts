import {
    computed,
    inject,
    onMounted,
    ref,
    toValue,
    type MaybeRefOrGetter,
    type Ref,
} from "vue"

import { formContextKey } from "./context"
import { internationalizationKey } from "@/foundations/internationalization/controller"
import type { RFormRequiredIndicator, RFormValidateTrigger } from "./types"

type UseFormFieldOptions<TValue> = {
    defaultValue: MaybeRefOrGetter<TValue>
    ignoreRequired?: boolean
    model: Ref<TValue | undefined>
    name: MaybeRefOrGetter<string | undefined>
    replaceNullish?: boolean
    required?: MaybeRefOrGetter<boolean | undefined>
}

/** Internal adapter shared by form-aware input components. */
export function useFormField<TValue>(options: UseFormFieldOptions<TValue>) {
    const context = inject(formContextKey, null)
    const internationalization = inject(internationalizationKey, null)
    const registered = ref(false)
    const name = computed(() => {
        const candidate = toValue(options.name)?.trim()
        return candidate || undefined
    })
    const bound = computed(() => !!context && !!name.value)
    const defaultValue = computed(() => toValue(options.defaultValue))

    function getForm() {
        return bound.value ? context!.form.value : null
    }

    onMounted(() => {
        const form = getForm()
        if (!form || !name.value) {
            registered.value = true
            return
        }

        form.registerField(name.value, defaultValue.value, {
            ignoreRequired: options.ignoreRequired,
            replaceNullish: options.replaceNullish,
        })
        registered.value = true
    })

    const model = computed<TValue>({
        get() {
            const form = getForm()
            if (!form || !name.value) {
                return options.model.value === undefined ? defaultValue.value : options.model.value
            }

            const value = form.getValue(name.value) as TValue | undefined
            return value === undefined ? defaultValue.value : value
        },
        set(value) {
            setValue(value, "input")
        },
    })

    const state = computed(() => {
        const form = getForm()
        return form && name.value ? form.getFieldState(name.value) : null
    })
    const required = computed(() => {
        const form = getForm()
        if (form && name.value) {
            return form.isFieldRequired(name.value)
        }

        return toValue(options.required) ?? false
    })
    const errorText = computed(() => {
        const form = getForm()
        const fieldState = state.value
        if (!form || !fieldState || !fieldState.invalid || (!fieldState.touched && !form.submitted)) {
            return undefined
        }

        const message = fieldState.errors[0]?.message
        if (message != null && typeof message !== "string") {
            throw new TypeError(`RForm field error at "${name.value}" must be a string.`)
        }

        return message
    })
    const requiredIndicator = computed<RFormRequiredIndicator | undefined>(() => {
        return bound.value ? context!.requiredIndicator.value : undefined
    })
    const helperIndicator = computed(() => {
        if (requiredIndicator.value !== "helper-required" || !required.value) {
            return undefined
        }

        return `*${internationalization?.resolveMessage("form.required") ?? " Required"}`
    })
    const labelSuffix = computed(() => {
        if (!bound.value) {
            return required.value ? "*" : undefined
        }

        if (requiredIndicator.value === "label-asterisk" && required.value) {
            return "*"
        }

        if (requiredIndicator.value === "label-optional" && !required.value) {
            return internationalization?.resolveMessage("form.optional") ?? " (Optional)"
        }

        return ""
    })

    function setValue(value: TValue, trigger: RFormValidateTrigger = "input") {
        const form = getForm()
        if (!form || !name.value) {
            options.model.value = value
            return
        }

        form.setValue(name.value, value)
        void form.validateField(name.value, trigger)
    }

    function onBlur() {
        const form = getForm()
        if (!form || !name.value) {
            return
        }

        form.setTouched(name.value)
        void form.validateField(name.value, "blur")
    }

    function onFocusout(event: FocusEvent) {
        const root = event.currentTarget
        if (root instanceof HTMLElement && event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) {
            return
        }

        onBlur()
    }

    return {
        bound,
        errorText,
        helperIndicator,
        labelSuffix,
        model,
        onBlur,
        onFocusout,
        registered,
        required,
        requiredIndicator,
        setValue,
        state,
    }
}
