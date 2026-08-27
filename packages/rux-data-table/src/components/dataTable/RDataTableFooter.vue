<script setup lang="ts">
import { RIChevronLeftFilled, RIChevronRightFilled, RIFirstPageFilled, RILastPageFilled } from "@ripple-design/icons"
import { RButtonRow, type RIconResolvableSource } from "@ripple-design/rui"
import { RIconButton, RSpinner, RSpinnerOption } from "@ripple-design/rui"

type RDataTableFooterOption = { label: string; value: number }

const props = withDefaults(
    defineProps<{
        footerOptions: readonly RDataTableFooterOption[]
        itemsLength: number
        itemsPerPage: number
        itemsPerPageText: string
        page: number
        pageCount: number
        pageText: string
        startIndex: number
        stopIndex: number
        firstIcon?: RIconResolvableSource
        firstPageLabel: string
        lastIcon?: RIconResolvableSource
        lastPageLabel: string
        mobile: boolean
        nextIcon?: RIconResolvableSource
        nextPageLabel: string
        prevIcon?: RIconResolvableSource
        prevPageLabel: string
        showCurrentPage: boolean
        showFirstLastPage: boolean
    }>(),
    {
        firstIcon: undefined,
        lastIcon: undefined,
        nextIcon: undefined,
        prevIcon: undefined,
    },
)
const emit = defineEmits<{
    (e: "update:itemsPerPage", value: number): void
    (e: "update:page", value: number): void
}>()
</script>

<template>
    <footer class="rux-data-table__footer" :class="{ 'rux-data-table__footer--mobile': mobile }">
        <slot name="prepend" />
        <span class="rux-data-table__items-per-page-label">{{ itemsPerPageText }}</span>
        <RSpinner
            class="rux-data-table__items-per-page-spinner"
            :model-value="itemsPerPage"
            :aria-label="itemsPerPageText"
            @update:model-value="emit('update:itemsPerPage', Number($event))"
        >
            <RSpinnerOption
                v-for="option in footerOptions"
                :key="option.value"
                :value="option.value"
                :label="option.label"
            />
        </RSpinner>
        <span class="rux-data-table__page-text">{{
            pageText
                .replace("{0}", String(itemsLength ? startIndex + 1 : 0))
                .replace("{1}", String(stopIndex))
                .replace("{2}", String(itemsLength))
        }}</span>
        <RButtonRow class="rux-data-table__pagination">
            <RIconButton
                v-if="showFirstLastPage"
                :icon="firstIcon ?? RIFirstPageFilled"
                :label="firstPageLabel"
                :disabled="page <= 1"
                @click="emit('update:page', 1)"
            />
            <RIconButton
                :icon="prevIcon ?? RIChevronLeftFilled"
                :label="prevPageLabel"
                :disabled="page <= 1"
                @click="emit('update:page', page - 1)"
            />
            <span v-if="showCurrentPage">{{ page }}</span>
            <RIconButton
                :icon="nextIcon ?? RIChevronRightFilled"
                :label="nextPageLabel"
                :disabled="page >= pageCount"
                @click="emit('update:page', page + 1)"
            />
            <RIconButton
                v-if="showFirstLastPage"
                :icon="lastIcon ?? RILastPageFilled"
                :label="lastPageLabel"
                :disabled="page >= pageCount"
                @click="emit('update:page', pageCount)"
            />
        </RButtonRow>
    </footer>
</template>

<style scoped lang="scss">
@use "@ripple-design/rui/rui";

.rux-data-table__footer {
    display: flex;
    align-items: center;
    gap: 8px;
}

.rux-data-table__footer {
    @include rui.typo-body2;

    color: rui.$color-on-surface-medium;
    flex-wrap: wrap;
    justify-content: end;
    padding: 0 0 0 16px;
    border-block-start: 1px solid var(--rui-comp-data-table-border-color);

    :deep(.rui-spinner.rux-data-table__items-per-page-spinner) {
        margin-inline-end: 16px;
    }

    .rux-data-table__page-text {
        margin-inline-end: 8px;
    }
}

.rux-data-table__footer--mobile {
    justify-content: stretch;
}

.rux-data-table__footer--mobile .rux-data-table__page-text {
    margin-inline-end: 0;
}
</style>
