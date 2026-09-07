<template>
  <el-dialog v-model="visible" width="500px">
    <el-descriptions>
      <el-descriptions-item v-for="item in data" :label="item.label" :key="item.value">
        {{ item.value }}
      </el-descriptions-item>
    </el-descriptions>
    <section class="loading-area" v-loading="laodingSection"></section>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    data: Record<string, string>[]
  }>(),
  {},
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const laodingSection = ref<true | false>(true)

onMounted(() => {
  setTimeout(() => {
    laodingSection.value = false
  }, 3000)
})
</script>

<style scoped lang="scss">
.loading-area {
  height: 100px;
}
</style>
