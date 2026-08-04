<script setup lang="ts">
import { RIMoreVertFilled } from "@ripple-design/icons"
import { RContextMenu, RIconButton, RMenuItem } from "@ripple-design/rui"
import { ref, useTemplateRef } from "vue"

interface User {
    id: number
    name: string
}

const users: User[] = [
    { id: 1, name: "Avery Stone" },
    { id: 2, name: "Jordan Lee" },
    { id: 3, name: "Morgan Reed" },
]
const activeUser = ref<User | null>(null)
const contextMenu = useTemplateRef<InstanceType<typeof RContextMenu>>("contextMenu")

function openAtPointer(event: MouseEvent, user: User) {
    activeUser.value = user
    contextMenu.value?.openAt(event)
}

function openAtElement(event: MouseEvent, user: User) {
    activeUser.value = user
    contextMenu.value?.openAt(event.currentTarget as HTMLElement)
}

function editUser() {
    console.log("Edit", activeUser.value?.id)
}

function removeUser() {
    console.log("Remove", activeUser.value?.id)
}
</script>

<template>
    <div class="user-list">
        <div
            v-for="user in users"
            :key="user.id"
            class="user-row"
            @contextmenu="openAtPointer($event, user)"
        >
            <span>{{ user.name }}</span>
            <RIconButton
                :icon="RIMoreVertFilled"
                label="More actions"
                @click="openAtElement($event, user)"
            />
        </div>
    </div>

    <RContextMenu ref="contextMenu">
        <RMenuItem @click="editUser">Edit {{ activeUser?.name }}</RMenuItem>
        <RMenuItem @click="removeUser">Remove {{ activeUser?.name }}</RMenuItem>
    </RContextMenu>
</template>

<style scoped>
.user-list {
    display: grid;
    inline-size: min(100%, 360px);
    border: 1px solid var(--rui-sys-color-outline, currentcolor);
    border-radius: 12px;
    overflow: hidden;
}

.user-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-block-size: 56px;
    padding-inline: 16px 8px;
}

.user-row + .user-row {
    border-block-start: 1px solid var(--rui-sys-color-outline, currentcolor);
}
</style>
