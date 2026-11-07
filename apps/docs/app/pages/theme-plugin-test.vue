<script setup lang="ts">
import ThemePluginTestMount from "@docs/components/demos/theme/ThemePluginTestMount.vue"

useHead({
    title: "RUI Plugin Test",
})
</script>

<template>
    <section>
        <h1>RUI Plugin Test</h1>
        <p>
            This page mounts a standalone Vue app, installs <code>ruiPlugin</code>, and exposes the
            injected theme state together with the computed primary CSS variable.
        </p>
        <ThemePluginTestMount />
    </section>
</template>
