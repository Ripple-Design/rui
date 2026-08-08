<script setup lang="ts">
import { RButton, RColumn, RRow, RSnackbarHost, RSnackbars } from "@ripple-design/rui"

function showBasic() {
    RSnackbars.show("Item archived")
}

function showAction() {
    RSnackbars.show({
        message: "Item archived",
        action: {
            label: "Undo",
            onClick: () => {},
        },
    })
}

function showIndefinite() {
    RSnackbars.show({
        message: "Uploading item…",
        duration: "indefinite",
    })
}

function showReplacement() {
    RSnackbars.show("First message")
    RSnackbars.show("This replaces the pending message")
}

function showSlide() {
    RSnackbars.show({
        message: "Slide animation",
        animation: "slide",
    })
}
</script>

<template>
    <RSnackbarHost />

    <RColumn gap="16px" class="snackbar-demo">
        <RRow gap="8px" wrap>
            <RButton @click="showBasic">Show snackbar</RButton>
            <RButton @click="showAction">Show action</RButton>
            <RButton @click="showIndefinite">Show indefinite</RButton>
            <RButton @click="showSlide">Show slide</RButton>
            <RButton @click="showReplacement">Show replacement</RButton>
        </RRow>
    </RColumn>
</template>

<style scoped lang="scss">
.snackbar-demo {
    width: 100%;
}
</style>
