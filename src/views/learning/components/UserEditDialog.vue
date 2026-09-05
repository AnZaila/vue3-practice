<template>
  <el-dialog
    :model-value="visible"
    :close-on-click-modal="true"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
    @closed="emit('closed')"
    width="550px"
  >
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-position="top">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="formModel.age"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button type="primary" plain @click="emit('update:visible', false)">取消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { User } from '@/types/learning'
import { ElMessage, type FormRules, type FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()

const formRules: FormRules<User> = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
}

const props = withDefaults(
  defineProps<{
    editUser: User | null
    visible: boolean
  }>(),
  {},
)

const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [value: User]
  closed: []
}>()

const formModel = reactive<User>({
  id: undefined,
  name: '',
  age: 0
})

watch(
  () => props.editUser,
  (newVal) => {
    if (newVal) {
      Object.assign(formModel, newVal)
    } else {
      formModel.id = undefined
      formModel.name = ''
      formModel.age = 0
    }
  },
  { immediate: true }
)

const submitForm = async () => {
  console.log(1111)
  if (!formRef.value) return
  await formRef.value.validate()
  emit('submit', { ...formModel })
  emit('update:visible', false)
  ElMessage.success('提交成功！')
}
</script>

<style scoped></style>
