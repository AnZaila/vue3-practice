<template>
  <div class="my-child2">
    <h3>Hello, I am {{ myName }}.</h3>
    <el-button type="primary" plain @click="sendData">click to send data to parent</el-button>
  </div>
</template>
<script setup lang="ts">
import { ref} from 'vue'
const myName = ref('MyChild2')
const age = ref(18)
// 二、emit / defineEmits (子传父)
// 注册自定义事件
const emit = defineEmits(['sendData'])
const sendData = () => {
  emit('sendData', myName.value, age.value)
}
</script>

<style scoped lang="scss">
.my-child2 {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 12px;
}
</style>
