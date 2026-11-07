<script setup lang="ts">
import { RIAddFilled, RIEditFilled, RIVisibilityFilled } from "@ripple-design/icons"
import { RFab, RColumn, RRow } from "@ripple-design/rui"
import { ref } from "vue"

const extended = ref(true)
const visible = ref(true)
</script>

<template>
    <RColumn gap="24px" class="fab-demo">
        <RRow gap="16px" wrap align="center">
            <RFab :icon="RIAddFilled" label="Add" />
            <RFab :icon="RIEditFilled" label="Edit" size="mini" />
            <RFab :icon="RIVisibilityFilled" label="Preview" size="auto" />
            <RFab :icon="RIAddFilled" label="Disabled add" disabled />
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RFab variant="extended" :icon="RIEditFilled">Edit</RFab>
            <RFab variant="extended">Create</RFab>
            <RFab variant="extended" :icon="RIAddFilled" :extended="extended">New item</RFab>
        </RRow>

        <RRow gap="16px" wrap align="center">
            <RFab :icon="RIAddFilled" label="Toggle visible" @click="visible = !visible" />
            <RFab variant="extended" :icon="RIEditFilled" label="Edit draft" :visible="visible">Edit draft</RFab>
            <RFab variant="extended" :icon="RIAddFilled" label="Toggle extended" @click="extended = !extended">
                {{ extended ? "Collapse" : "Expand" }}
            </RFab>
        </RRow>
    </RColumn>
</template>

<style scoped lang="scss">
.fab-demo {
    width: 100%;
}
</style>
