<script setup lang="ts">
import { RColumn } from "@ripple-design/rui"
import { RMessage, RMessageGroup } from "@ripple-design/rux-chat"
</script>

<template>
    <RColumn gap="8px">
        <RMessageGroup
            sender="other"
            :avatar="{ src: '/images/docs/components/tile/coast.svg', alt: 'Call participant' }"
        >
            <RMessage>Are you joining the call?</RMessage>
            <RMessage>We are starting in a few minutes.</RMessage>
        </RMessageGroup>

        <RMessageGroup sender="self">
            <RMessage>I will be there in five minutes.</RMessage>
            <RMessage>Feel free to begin without me.</RMessage>
        </RMessageGroup>

        <RMessageGroup sender="other">
            <RMessage>Great, see you soon.</RMessage>
        </RMessageGroup>
    </RColumn>
</template>
