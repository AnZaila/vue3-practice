<template>
  <div class="my-child1">
    <h3>Hello, I am {{ myName }}.</h3>
    <p>This is my props that I received from the parent component: {{ props.menuList }}</p>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const myName = ref('MyChild1')
const changeMyName = () => {
  myName.value += '6'
}
// 获取props
// 一、父传子
// 方式一：简介写法（无类型校验）
// const props = defineProps(['menuList']) // 不推荐
// 方式二：完整写法（有类型校验）// 推荐
const props = defineProps({
  menuList: {
    type: Array,
    default: () => [],
  }
})
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
