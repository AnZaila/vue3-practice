<template>
  <el-dialog
    :model-value="visible"
    :title="dialogTitle"
    width="680px"
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
    @closed="emit('closed')"
  >
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-position="top">
      <div class="form-grid">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formModel.name" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="formModel.manager" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formModel.phone" />
        </el-form-item>
        <el-form-item label="上级部门" prop="parent">
          <el-select v-model="formModel.parent">
            <el-option v-for="item in parents" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formModel.status">
            <el-radio v-for="item in statuses" :key="item.value" :label="item.value" border>
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="span-2" label="说明" prop="note">
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
import type { DepartmentFormModel, OrgOption, OrgStatus } from '@/types/organization'

const props = withDefaults(
  defineProps<{
    visible: boolean
    loading?: boolean
    mode: 'create' | 'edit'
    modelValue: DepartmentFormModel
    parents: OrgOption[]
    statuses: Array<{
      label: string
      value: OrgStatus
    }>
  }>(),
  {
    loading: false,
  },
)

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
  (event: 'submit', value: DepartmentFormModel): void
  (event: 'closed'): void
}>()

const formRef = ref<FormInstance>()
const formModel = reactive<DepartmentFormModel>({
  name: '',
  manager: '',
  phone: '',
  parent: '',
  status: 'active',
  note: '',
})

const dialogTitle = computed(() => (props.mode === 'create' ? '新建部门' : '编辑部门'))

const formRules: FormRules<DepartmentFormModel> = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  manager: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  parent: [{ required: true, message: '请选择上级部门', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function syncModel(value: DepartmentFormModel) {
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
