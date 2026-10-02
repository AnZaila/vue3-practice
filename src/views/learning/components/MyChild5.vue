<!-- <template>
  <el-dialog
    :model-value="visible"
    :close-on-click-modal="true"
    @update:model-value="emit('update:visible', $event)"
    @closed="emit('closed')"
  >
    <div v-for="data in userData" :key="data.label">
      <span>{{ data.label }}</span>
      <strong>{{ data.value }}</strong>
    </div>
    <template #footer>
      <el-button type="primary" plain @click="emit('update:visible', false)">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    visible: boolean
    userData: Record<string, string | number>[]
  }>(),
  {},
)
console.log('props', props.userData)
const emit = defineEmits<{
  'update:visible': [value: boolean]
  closed: []
}>()
</script>

<style scoped lang="scss"></style> -->

<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="true"
    @closed="emit('closed')"
  >
    <div v-for="data in userData" :key="data.label">
      <span>{{ data.label }}</span>
      <strong>{{ data.value }}</strong>
    </div>
    <template #footer>
      <el-button type="primary" plain @click="emit('update:modelValue', false)">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    userData: Record<string, string | number>[]
  }>(),
  {},
)
console.log('props', props.userData)
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  closed: []
}>()

const visible = computed({
  get: () => {
    return props.modelValue
  },
  set: (value: boolean) => {
    return emit('update:modelValue', value)
  },
})
</script>

<style scoped lang="scss"></style>
