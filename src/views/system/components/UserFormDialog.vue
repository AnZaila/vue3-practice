<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="720px"
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
    @closed="emit('closed')"
  >
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-position="top">
      <div class="form-grid">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formModel.name" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formModel.email" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="formModel.department">
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formModel.role">
            <el-option v-for="item in roles" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formModel.phone" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formModel.status">
            <el-radio v-for="item in statuses" :key="item.value" :label="item.value" border>
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="span-2" label="备注" prop="note">
          <el-input v-model="formModel.note" type="textarea" :rows="3" maxlength="80" show-word-limit />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import type { UserFormModel, UserOption, UserStatus } from '@/types/user'

const props = withDefaults(
  defineProps<{
    visible: boolean
    loading?: boolean
    mode: 'create' | 'edit'
    modelValue: UserFormModel
    roles: UserOption[]
    departments: UserOption[]
    statuses: Array<{
      label: string
      value: UserStatus
    }>
  }>(),
  {
    loading: false,
  },
)

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
  (event: 'submit', value: UserFormModel): void
  (event: 'closed'): void
}>()

const formRef = ref<FormInstance>()

const emptyForm = (): UserFormModel => ({
  name: '',
  email: '',
  role: '',
  department: '',
  phone: '',
  status: 'active',
  note: '',
})

const formModel = reactive<UserFormModel>(emptyForm())

const dialogTitle = computed(() => (props.mode === 'create' ? '新建用户' : '编辑用户'))

const formRules: FormRules<UserFormModel> = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function syncModel(value: UserFormModel) {
  Object.assign(formModel, value)
  formRef.value?.clearValidate()
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      syncModel(props.modelValue)
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (value) => {
    if (props.visible) {
      syncModel(value)
    }
  },
  { deep: true },
)

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

<style scoped lang="scss">
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
}

.span-2 {
  grid-column: span 2;
}

@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .span-2 {
    grid-column: auto;
  }
}
</style>
