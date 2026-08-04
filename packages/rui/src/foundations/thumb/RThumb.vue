<script setup lang="ts">
withDefaults(
    defineProps<{
        halo?: boolean
        haloVisible?: boolean
    }>(),
    {
        halo: false,
        haloVisible: false,
    },
)
</script>

<template>
    <span class="rui-thumb" aria-hidden="true">
        <span v-if="halo" class="rui-thumb__halo" :class="{ 'rui-thumb__halo--visible': haloVisible }" />
        <span class="rui-thumb__underlay"><slot name="underlay" /></span>
        <span class="rui-thumb__knob" />
        <span class="rui-thumb__overlay"><slot /></span>
    </span>
</template>

<style scoped lang="scss">
.rui-thumb {
    position: relative;
    display: block;
    inline-size: var(--rui-comp-thumb-size, 20px);
    block-size: var(--rui-comp-thumb-size, 20px);
}

.rui-thumb__halo,
.rui-thumb__underlay,
.rui-thumb__knob,
.rui-thumb__overlay {
    position: absolute;
}

.rui-thumb__halo {
    inset: 50%;
    z-index: 0;
    inline-size: var(--rui-comp-thumb-halo-size, 40px);
    block-size: var(--rui-comp-thumb-halo-size, 40px);
    border-radius: 50%;
    background: var(--rui-comp-thumb-halo-color, transparent);
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(0.8);
    transition:
        opacity var(--rui-comp-thumb-halo-duration, var(--rui-sys-motion-duration-small-in)) var(--rui-comp-thumb-halo-easing, var(--rui-sys-motion-easing-standard)),
        transform var(--rui-comp-thumb-halo-duration, var(--rui-sys-motion-duration-small-in)) var(--rui-comp-thumb-halo-easing, var(--rui-sys-motion-easing-standard));

    &--visible {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

.rui-thumb__underlay,
.rui-thumb__overlay {
    inset: 0;
    pointer-events: none;
}

.rui-thumb__underlay {
    z-index: 1;
}

.rui-thumb__knob {
    z-index: 2;
    inset: 0;
    border-radius: 50%;
    background: var(--rui-comp-thumb-color);
    box-shadow: var(--rui-comp-thumb-shadow);
}

.rui-thumb__overlay {
    z-index: 3;
}

@media (prefers-reduced-motion: reduce) {
    .rui-thumb__halo {
        transition-duration: 0ms !important;
    }
}
</style>
