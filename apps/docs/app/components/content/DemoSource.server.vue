<script setup lang="ts">
import { codeToHtml } from "shiki"

const props = withDefaults(
    defineProps<{
        demo: string
        language?: string
    }>(),
    {
        language: "vue",
    },
)

const demoSources = import.meta.glob("../demos/**/*.vue", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>

const key = Object.keys(demoSources).find((path) => path.endsWith(`/${props.demo}.vue`))
const source = key ? demoSources[key] : ""
const highlightedCode = source
    ? await codeToHtml(source.trimEnd(), {
          lang: props.language,
          theme: "github-light",
      })
    : ""
</script>

<template>
    <div v-html="highlightedCode" />
</template>
