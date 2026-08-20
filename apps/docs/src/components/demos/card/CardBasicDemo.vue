<script setup lang="ts">
import { RIEditFilled, RIMoreVertFilled } from "@ripple-design/icons"
import { RButton, RCard, RCardHeader, RColumn, RIconButton } from "@ripple-design/rui"
import { ref } from "vue"

const dragged = ref(false)
const selected = ref(false)
const activated = ref(false)
</script>

<template>
    <RColumn gap="16px" class="card-demo">
        <RCard>
            <RCardHeader title="Elevated card" text="Hover to raise its elevation from level 2 to level 8.">
                <template #actions>
                    <RIconButton :icon="RIEditFilled" label="Edit" />
                    <RIconButton :icon="RIMoreVertFilled" label="More actions" />
                </template>
            </RCardHeader>
        </RCard>

        <RCard variant="outlined">
            <div class="card-demo__content">
                <strong>Outlined card</strong>
                <p>Hover and drag use the same elevation treatment.</p>
            </div>
        </RCard>

        <RCard color="primary">
            <div class="card-demo__content">
                <strong>Primary content color</strong>
                <p>Surface color controls the default content and ripple color.</p>
            </div>
        </RCard>

        <RCard clickable selectable :selected="selected">
            <div class="card-demo__content">
                <strong>Controlled selected state</strong>
                <p>Selected cards apply an 8% content-color state layer.</p>
                <RButton variant="outlined" @click="selected = !selected">
                    {{ selected ? "Clear selection" : "Select" }}
                </RButton>
            </div>
        </RCard>

        <RCard :activated="activated">
            <div class="card-demo__content">
                <strong>Activated state</strong>
                <p>Activation uses a primary 2px inner outline without a state layer.</p>
                <RButton variant="outlined" @click="activated = !activated">
                    {{ activated ? "Deactivate" : "Activate" }}
                </RButton>
            </div>
        </RCard>

        <RCard :dragged="dragged">
            <div class="card-demo__content">
                <strong>Controlled drag state</strong>
                <p>Enable the state to preview the raised drag treatment.</p>
                <RButton variant="outlined" @click="dragged = !dragged">
                    {{ dragged ? "End drag" : "Start drag" }}
                </RButton>
            </div>
        </RCard>
    </RColumn>
</template>

<style scoped lang="scss">
.card-demo {
    width: 100%;
}

.card-demo__content {
    padding: 16px;
}

.card-demo__content p {
    margin: 8px 0 16px;
}
</style>
