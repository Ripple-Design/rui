<script setup lang="ts">
import type { Ref } from "vue"

import IconsExplorer from "@docs/components/icons/IconsExplorer.vue"
import type { IconVariant } from "@docs/lib/icons"
import { ICON_STYLES } from "@docs/lib/icons"

const route = useRoute()
const locale = useI18n().locale as Ref<string>
const currentStyle = computed<IconVariant>(() => {
    const style = route.params.style as IconVariant | undefined
    return style && ICON_STYLES.includes(style) ? style : ICON_STYLES[0]
})
const currentDir = computed(() => (typeof route.query.dir === "string" ? route.query.dir : null))

useHead({
    title: "Icons",
})
</script>

<template>
    <ClientOnly>
        <IconsExplorer :locale="locale" :current-style="currentStyle" :current-dir="currentDir" />
    </ClientOnly>
</template>
