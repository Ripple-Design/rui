<script setup lang="ts" generic="TValues extends RFormValues">
import { computed, provide, useAttrs } from "vue"

import { formContextKey, type RFormContext } from "./context"
import type {
    RFormInvalidSubmitEvent,
    RFormProps,
    RFormSubmitEvent,
    RFormValues,
} from "./types"

defineOptions({ inheritAttrs: false })

const props = defineProps<RFormProps<TValues>>()
const emit = defineEmits<{
    invalidSubmit: [event: RFormInvalidSubmitEvent<TValues>]
    submit: [event: RFormSubmitEvent<TValues>]
}>()

const attrs = useAttrs()

async function submit(nativeEvent?: SubmitEvent) {
    props.form.markSubmitted()
    const valid = await props.form.validate()

    if (valid) {
        emit("submit", {
            form: props.form,
            nativeEvent,
            value: props.form.value,
        })
    } else {
        emit("invalidSubmit", {
            form: props.form,
            nativeEvent,
        })
    }

    return valid
}

function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    void submit(event)
}

provide(formContextKey, {
    form: computed(() => props.form) as RFormContext["form"],
    requiredIndicator: computed(() => props.requiredIndicator),
    submit,
})

defineExpose({ submit })
</script>

<template>
    <form v-bind="attrs" novalidate @submit="handleSubmit">
        <slot />
    </form>
</template>
