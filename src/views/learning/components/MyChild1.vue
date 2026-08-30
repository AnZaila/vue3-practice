<template>
  <div class="my-child1">
    <h3>Hello, I am {{ myName }}.</h3>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const myName = ref('MyChild1')
const changeMyName = () => {
  myName.value += '6'
}
// 暴露给父组件
defineExpose({
  myName,
  changeMyName,
})
</script>

<style scoped lang="scss">
.my-child1 {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 12px;
}
</style>
