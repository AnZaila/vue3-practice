<template>
  <el-drawer :model-value="visible" title="用户详情" size="420px" destroy-on-close @update:model-value="emit('update:visible', $event)">
    <template v-if="user">
      <div class="drawer-header">
        <div>
          <strong>{{ user.name }}</strong>
          <p>{{ user.email }}</p>
        </div>
        <el-tag :type="statusTagType" effect="light">
          {{ statusLabel }}
        </el-tag>
      </div>

      <el-descriptions :column="1" border class="detail-desc">
        <el-descriptions-item label="部门">{{ departmentLabel }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ roleLabel }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ user.phone }}</el-descriptions-item>
        <el-descriptions-item label="最近登录">{{ user.lastLogin }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ user.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ user.note }}</el-descriptions-item>
      </el-descriptions>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserOption, UserRecord, UserStatus } from '@/types/user'

const props = defineProps<{
  visible: boolean
  user: UserRecord | null
  roles: UserOption[]
  departments: UserOption[]
}>()

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
}>()

const statusLabelMap: Record<UserStatus, string> = {
  active: '启用',
  frozen: '停用',
  pending: '待审核',
}

const statusTagMap: Record<UserStatus, 'success' | 'warning' | 'info'> = {
  active: 'success',
  frozen: 'info',
  pending: 'warning',
}

const roleLabel = computed(() => {
  if (!props.user) {
    return '--'
  }

  return props.roles.find((item) => item.value === props.user?.role)?.label ?? props.user.role
})

const departmentLabel = computed(() => {
  if (!props.user) {
    return '--'
  }

  return props.departments.find((item) => item.value === props.user?.department)?.label ?? props.user.department
})

const statusLabel = computed(() => {
  if (!props.user) {
    return '--'
  }

  return statusLabelMap[props.user.status]
})

const statusTagType = computed(() => {
  if (!props.user) {
    return 'info'
  }

  return statusTagMap[props.user.status]
})
</script>

<style scoped lang="scss">
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  strong {
    display: block;
    color: var(--color-text-strong);
    font-size: 20px;
  }

  p {
    margin: 6px 0 0;
    color: var(--color-text-muted);
    font-size: 13px;
  }
}

.detail-desc {
  --el-descriptions-table-border: var(--color-border);
}
</style>
