<script setup lang="ts">
import {
    RButton,
    RColumn,
    RCircularProgressIndicator,
    RLinearProgressIndicator,
    RNumberField,
    RRow,
    RText,
} from "@ripple-design/rui"
import { ref } from "vue"

const circularClosed = ref(false)
const linearClosed = ref(false)
const determinateProgress = ref(0.55)
const bufferProgress = ref(0.8)
const indeterminateMode = ref(true)
const contiguousMode = ref(true)
const contiguousColors = ["#4285f4", "#34a853", "#fbbc05", "#ea4335"]
const reversedIndeterminateMode = ref(true)
const queryMode = ref(true)

function completeIndeterminate() {
    indeterminateMode.value = false
}

function completeContiguous() {
    contiguousMode.value = false
}

function completeQuery() {
    queryMode.value = false
}
</script>

<template>
    <RColumn gap="24px" class="progress-indicator-demo">
        <RColumn gap="12px">
            <RText>Determinate controls</RText>
            <RRow gap="12px" wrap align="center">
                <RNumberField v-model="determinateProgress" label="Progress" input-type="decimal" :min="0" />
                <RNumberField v-model="bufferProgress" label="Buffer" input-type="decimal" :min="0" />
            </RRow>
        </RColumn>

        <RColumn gap="12px">
            <RText>RCircularProgressIndicator</RText>
            <RRow gap="12px" wrap align="center">
                <RButton variant="outlined" sentence-case @click="circularClosed = !circularClosed">
                    Toggle circular closed
                </RButton>
            </RRow>
            <RRow gap="20px" wrap align="center">
                <RCircularProgressIndicator :progress="determinateProgress" :closed="circularClosed" />
                <RCircularProgressIndicator :progress="determinateProgress" :size="36" :closed="circularClosed" />
                <RCircularProgressIndicator :progress="determinateProgress" :size="24" :closed="circularClosed" />
            </RRow>
            <RRow gap="20px" wrap align="center">
                <RCircularProgressIndicator :progress="determinateProgress" reversed :closed="circularClosed" />
                <RCircularProgressIndicator indeterminate reversed :closed="circularClosed" />
            </RRow>
            <RRow gap="20px" wrap align="center">
                <RCircularProgressIndicator indeterminate :closed="circularClosed" />
                <RCircularProgressIndicator
                    indeterminate
                    :indicator-colors="contiguousColors"
                    :closed="circularClosed"
                />
            </RRow>
        </RColumn>

        <RColumn gap="12px" class="progress-indicator-demo__linear">
            <RText>RLinearProgressIndicator</RText>
            <RRow gap="12px" wrap align="center">
                <RButton variant="outlined" sentence-case @click="linearClosed = !linearClosed">
                    Toggle linear closed
                </RButton>
            </RRow>
            <RLinearProgressIndicator :progress="determinateProgress" :closed="linearClosed" />
            <RLinearProgressIndicator :progress="determinateProgress" :buffer="bufferProgress" :closed="linearClosed" />

            <RColumn gap="8px">
                <RText>Indeterminate</RText>
                <RText variant="body2"
                    >Start a lane, then stop it mid-flight to inspect the natural draining exit.</RText
                >
                <RRow gap="12px" wrap align="center">
                    <RButton variant="outlined" sentence-case @click="indeterminateMode = true">
                        Start indeterminate
                    </RButton>
                    <RButton variant="outlined" sentence-case @click="completeIndeterminate">
                        Complete indeterminate
                    </RButton>
                </RRow>
                <RLinearProgressIndicator :indeterminate="indeterminateMode" :closed="linearClosed" />
            </RColumn>

            <RColumn gap="8px">
                <RText>Contiguous</RText>
                <RText variant="body2"
                    >Contiguous mode cycles a three-segment color queue and returns to determinate immediately when
                    completed.</RText
                >
                <RRow gap="12px" wrap align="center">
                    <RButton variant="outlined" sentence-case @click="contiguousMode = true">
                        Start contiguous
                    </RButton>
                    <RButton variant="outlined" sentence-case @click="completeContiguous">
                        Complete contiguous
                    </RButton>
                </RRow>
                <RLinearProgressIndicator
                    :indeterminate="contiguousMode"
                    indeterminate-animation-type="contiguous"
                    :indicator-colors="contiguousColors"
                    direction="right-to-left"
                    :closed="linearClosed"
                />
            </RColumn>

            <RColumn gap="8px">
                <RText>Query</RText>
                <RText variant="body2"
                    >Query reuses the reverse pulse timeline and drains naturally before returning to
                    determinate.</RText
                >
                <RRow gap="12px" wrap align="center">
                    <RButton variant="outlined" sentence-case @click="queryMode = true"> Start query </RButton>
                    <RButton variant="outlined" sentence-case @click="completeQuery"> Complete query </RButton>
                </RRow>
                <RLinearProgressIndicator
                    :query="queryMode"
                    :progress="determinateProgress"
                    direction="end-to-start"
                    :closed="linearClosed"
                />
            </RColumn>
        </RColumn>
    </RColumn>
</template>

<style scoped lang="scss">
.progress-indicator-demo {
    width: 100%;
}

.progress-indicator-demo__linear {
    width: 100%;
    max-width: 320px;
}
</style>
