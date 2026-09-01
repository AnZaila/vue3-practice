<template>
  <div class="my-child3">
    <h3>Hello, I am {{ myName }}.</h3>
    <span>brotherEvent: {{ brotherEvent }}</span>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bus } from '@/utils/bus'
const myName = ref('MyChild3')
const age = ref(18)
const changeMyName = () => {
  myName.value += '3'
}
// 三、expose / defineExpose （父获取子组件实例/数据方法）
defineExpose({
  myName,
  age,
  changeMyName,
})

//
const brotherEvent = ref('')
onMounted(() => {
  bus.on('brotherEvent', (val) => {
    brotherEvent.value = val as string
  })
})
</script>

<style scoped lang="scss">
.my-child3 {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 12px;
}
</style>
