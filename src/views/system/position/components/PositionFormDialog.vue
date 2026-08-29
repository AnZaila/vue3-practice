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
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="formModel.name" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="岗位等级" prop="level">
          <el-select v-model="formModel.level">
            <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-select v-model="formModel.department">
            <el-option
              v-for="item in departments"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="编制人数" prop="headcount">
          <el-input-number v-model="formModel.headcount" :min="1" :max="999" controls-position="right" />
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
import type { OrgOption, OrgStatus, PositionFormModel } from '@/types/organization'

const props = withDefaults(
  defineProps<{
    visible: boolean
    loading?: boolean
    mode: 'create' | 'edit'
    modelValue: PositionFormModel
    levels: OrgOption[]
    departments: OrgOption[]
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
  (event: 'submit', value: PositionFormModel): void
  (event: 'closed'): void
}>()

const formRef = ref<FormInstance>()
const formModel = reactive<PositionFormModel>({
  name: '',
  level: '',
  department: '',
  headcount: 1,
  status: 'active',
  note: '',
})

const dialogTitle = computed(() => (props.mode === 'create' ? '新建岗位' : '编辑岗位'))

const formRules: FormRules<PositionFormModel> = {
  name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择岗位等级', trigger: 'change' }],
  department: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
  headcount: [{ required: true, message: '请输入编制人数', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

function syncModel(value: PositionFormModel) {
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
