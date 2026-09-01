<template>
  <div class="my-child4">
    <h3>Hello, I am {{ myName }}.</h3>
    <p>color: {{ color }}</p>
    <p>height: {{ height }}</p>
    <input
      type="text"
      :value="color"
      @input="$emit('update:color', ($event.target as HTMLInputElement)?.value || '')"
    />
    <input
      type="number"
      :value="height"
      @input="$emit('update:height', ($event.target as HTMLInputElement).value || 0)"
    />
    <DeepChild />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { bus } from '@/utils/bus' // 事件总线
import DeepChild from './DeepChild.vue'
const myName = ref('MyChild4')
// 情况四：v-model 父子双向绑定 Vue3 支持单个/多个 v-model，本质是 props + emit
// 使用 defineProps 和 defineEmits 接收
// 方式一
// defineProps({
//   userName: String,
//   age: Number,
//   modelValue: String, // 默认的可以这样接收
// })
// 使用TS类型定义props
// 方式二
interface Props {
  color?: string
  height?: number
  modelValue?: string
}
defineProps<Props>()
// 如果你需要默认值，可以用 withDefaults
// withDefaults(defineProps<Props>(), {
//   userName: '',
//   age: 0,
//   modelValue: ''
// })
// 强烈建议不要有空格 'update: color' × 官方建议
defineEmits(['update:color', 'update:height', 'update:modelValue'])

// onMounted
onMounted(() => {
  bus.emit('brotherEvent', '来自兄弟MyChild4组件数据')
})
</script>

<style scoped lang="scss">
.my-child4 {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 12px;
}
</style>
