<script setup lang="ts">
import { RColumn, RRow, RSwitch } from "@ripple-design/rui"
import { ref } from "vue"

const enabled = ref(false)
</script>

<template>
 <RColumn gap="20px" class="switch-demo">
 <RRow gap="20px" align="center" wrap>
 <label>
 <RSwitch v-model="enabled" name="enabled" />
 Enabled: {{ enabled }}
 </label>
 <label><RSwitch :model-value="true" disabled /> Disabled on</label>
 <label><RSwitch :model-value="false" disabled /> Disabled off</label>
 </RRow>

 <RRow dir="rtl" gap="20px" align="center" wrap>
 <label><RSwitch :model-value="true" /> RTL on</label>
 <label><RSwitch :model-value="false" /> RTL off</label>
 </RRow>
 </RColumn>
</template>

<style scoped lang="scss">
.switch-demo {
 width:100%;
}

label {
 display: inline-flex;
 align-items: center;
 gap:8px;
}
</style>
