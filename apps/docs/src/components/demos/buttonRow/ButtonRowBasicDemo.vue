<script setup lang="ts">
import { RIMoreVertFilled } from "@ripple-design/icons"
import { RButton, RButtonRow, RColumn, RIconButton } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="20px" class="button-row-demo">
        <RButtonRow>
            <RButton>Cancel</RButton>
            <RButton>Preview</RButton>
            <RButton variant="contained">Save</RButton>

            <template #end>
                <RIconButton :icon="RIMoreVertFilled" label="More actions" />
            </template>
        </RButtonRow>

        <RButtonRow variant="outlined" class="button-row-demo__wrapping">
            <RButton>Discard changes</RButton>
            <RButton>Preview</RButton>
            <RButton>Save changes</RButton>
        </RButtonRow>

        <section dir="rtl">
            <RButtonRow variant="outlined">
                <RButton>إلغاء</RButton>
                <RButton>معاينة</RButton>
                <RButton variant="contained">حفظ</RButton>
            </RButtonRow>
        </section>
    </RColumn>
</template>

<style scoped lang="scss">
.button-row-demo {
    width: 100%;
}

.button-row-demo__wrapping {
    max-width: 260px;
}
</style>
