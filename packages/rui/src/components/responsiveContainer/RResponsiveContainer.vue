<script setup lang="ts">
import { computed } from "vue"

import type { RResponsiveContainerProps } from "./types"

const props = withDefaults(defineProps<RResponsiveContainerProps>(), {
    mode: "centered",
})

const style = computed(() => ({
    "--rui-comp-responsive-container-max-width": props.maxWidth,
}))
</script>

<template>
    <div class="rui-responsive-container-frame">
        <div class="rui-responsive-container" :class="`rui-responsive-container--${mode}`" :style="style">
            <slot />
        </div>
    </div>
</template>

<style scoped lang="scss">
.rui-responsive-container-frame {
    inline-size: 100%;
    min-inline-size: 0;
    container-type: inline-size;
}

.rui-responsive-container {
    box-sizing: border-box;
    inline-size: 100%;
    min-inline-size: 0;
    padding-inline: 16px;
}

.rui-responsive-container--centered {
    margin-inline: auto;
}

@container (min-width: 600px) {
    .rui-responsive-container {
        padding-inline: 32px;
    }
}

@container (min-width: 905px) {
    .rui-responsive-container--centered {
        inline-size: min(100%, var(--rui-comp-responsive-container-max-width, 840px));
        padding-inline: 0;
    }
}

@container (min-width: 1240px) {
    .rui-responsive-container--centered {
        inline-size: calc(100% - 400px);
        max-inline-size: var(--rui-comp-responsive-container-max-width, none);
    }
}

@container (min-width: 1440px) {
    .rui-responsive-container--centered {
        inline-size: min(calc(100% - 64px), var(--rui-comp-responsive-container-max-width, 1040px));
    }
}
</style>
