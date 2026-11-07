<script setup lang="ts">
import { RColumn } from "@ripple-design/rui"
import { RMessage } from "@ripple-design/rux-chat"
</script>

<template>
    <RColumn gap="16px">
        <RMessage sender="other">Other message</RMessage>
        <RMessage sender="self" clickable>Self message</RMessage>
        <RMessage sender="assistant">Assistant message</RMessage>
    </RColumn>
</template>
