<script setup lang="ts">
import { RColumn, RText } from "@ripple-design/rui"
</script>

<template>
    <RColumn gap="16px" class="text-demo">
        <RText variant="headline1">Headline 1</RText>
        <RText variant="headline2">Headline 2</RText>
        <RText variant="headline3">Headline 3</RText>
        <RText variant="headline4">Headline 4</RText>
        <RText variant="headline5">Headline 5</RText>
        <RText variant="headline6">Headline 6</RText>
        <RText variant="subtitle1">Subtitle 1</RText>
        <RText variant="subtitle2">Subtitle 2</RText>
        <RText variant="body1">Body 1</RText>
        <RText variant="body2">Body 2</RText>
        <RText variant="caption">Caption</RText>
        <RText variant="overline">Overline</RText>
        <RText variant="button">Button</RText>
    </RColumn>
</template>

<style scoped lang="scss">
.text-demo {
    width: 100%;
}
</style>
