<template>
  <el-dialog
    class="info-dialog"
    :model-value="visible"
    :title="dialogTitle"
    destroy-on-close
    width="500px"
    :close-on-click-modal="true"
    @open="handleOpen"
    @update:model-value="emit('update:visible', $event)"
    @closed="emit('closed')"
  >
  <!-- el‑dialog 源码内部 $event 就是 false -->
   <p>msg: {{ msg }}</p>
   <el-button type="primary" plain @click="emit('change:msg', '嘻嘻嘻')">更改信息</el-button>
    <el-descriptions v-if="mode === 'show'" :column="1" border>
      <el-descriptions-item label="用户名">{{ displayUser.username }}</el-descriptions-item>
      <el-descriptions-item label="密码">{{ displayUser.password }}</el-descriptions-item>
      <el-descriptions-item label="年龄">{{ displayUser.age ?? '--' }}</el-descriptions-item>
    </el-descriptions>

    <el-form v-else ref="formRef" :model="formModel" :rules="formRules" label-position="top">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formModel.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formModel.password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="formModel.age" :min="1" :max="120" controls-position="right" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">
        {{ mode === 'show' ? '关闭' : '取消' }}
      </el-button>
      <el-button v-if="mode === 'create'" type="primary" :loading="loading" @click="submitForm">
        新增
      </el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import type { InfoDialogMode, UserInfo } from '@/types/learning'

const dialogTitle = computed(() => {
  return props.mode === 'create' ? '新增信息' : '详细信息'
})

const props = withDefaults(
  defineProps<{
    visible: boolean
    loading?: boolean
    user?: UserInfo | null
    mode: InfoDialogMode
    msg?:string
  }>(),
  {
    loading: false,
    user: null,
  },
)
// 方式一
// const emit = defineEmits<{
//   (event: 'update:visible', value: boolean): void
//   (event: 'submit', value: UserInfo): void
//   // closed 关闭动画完全结束之后触发
//   (event: 'closed'): void
// }>()

// 方式二
const emit = defineEmits<{
  // 这里的 value 可以随便命名。甚至可以不写
  'update:visible': [value: boolean]
  'submit': [UserInfo]
  'closed': []
  'change:msg': [string]
}>()

const formRef = ref<FormInstance>()

const createEmptyUser = (): UserInfo => ({
  username: '',
  password: '',
  age: null,
})

const formModel = reactive<UserInfo>(createEmptyUser())
const displayUser = computed(() => props.user ?? createEmptyUser())

const formRules: FormRules<UserInfo> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'change' }],
}

function handleOpen() {
  if (props.mode === 'create') {
    Object.assign(formModel, createEmptyUser())
    formRef.value?.clearValidate()
  }
}

async function submitForm() {
  if (!formRef.value) {
    return
  }

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  emit('submit', { ...formModel })
}
</script>

<style scoped></style>
