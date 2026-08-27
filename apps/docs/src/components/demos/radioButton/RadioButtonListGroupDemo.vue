<script setup lang="ts">
import { RRadioButtonListGroup, RRadioButtonListItem } from "@ripple-design/rui"
import { ref } from "vue"

const selected = ref("standard")
</script>

<template>
    <div class="radio-button-list-group-demo">
        <RRadioButtonListGroup v-model="selected" name="plan-list" aria-label="Plans">
            <RRadioButtonListItem value="standard">
                Standard
                <template #supporting>For personal projects and small teams.</template>
                <template #trailing>$12</template>
            </RRadioButtonListItem>
            <RRadioButtonListItem value="pro">
                Pro
                <template #supporting>For growing teams with shared workspaces.</template>
                <template #trailing>$28</template>
            </RRadioButtonListItem>
            <RRadioButtonListItem value="enterprise" disabled>
                Enterprise
                <template #supporting>Advanced controls and dedicated support.</template>
                <template #trailing>Contact</template>
            </RRadioButtonListItem>
        </RRadioButtonListGroup>
        <p>Selected: {{ selected }}</p>
    </div>
</template>

<style scoped lang="scss">
.radio-button-list-group-demo {
    width: 100%;
    max-width: 420px;
}

p {
    margin: 16px 0 0;
}
</style>
