<template>
  <div class="user-home" v-loading="loading">
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">USER CENTER</span>
        <h2>用户管理</h2>
        <p>管理平台账号、状态、角色和最近登录信息，支持新增、编辑、停用与删除。</p>
      </div>
      <div class="hero-actions">
        <el-button :loading="loading" @click="reloadUsers">刷新列表</el-button>
        <el-button type="primary" @click="openCreateDialog">新建用户</el-button>
      </div>
    </section>

    <section class="stats-grid">
      <article v-for="item in stats" :key="item.label" class="stat-card">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.change }}</small>
      </article>
    </section>

    <el-card shadow="never" class="filter-card">
      <div class="filter-grid">
        <el-input
          v-model="filters.keyword"
          clearable
          placeholder="搜索姓名 / 邮箱 / 手机号"
          class="filter-item"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="filters.status" class="filter-item" placeholder="全部状态" @change="handleSearch">
          <el-option label="全部状态" value="all" />
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="filters.role" class="filter-item" placeholder="全部角色" @change="handleSearch">
          <el-option label="全部角色" value="all" />
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="filters.department" class="filter-item" placeholder="全部部门" @change="handleSearch">
          <el-option label="全部部门" value="all" />
          <el-option
            v-for="item in departmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="filter-actions">
          <el-button @click="resetFilters">重置</el-button>
          <el-button type="primary" @click="reloadUsers">查询</el-button>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="panel-title">
          <div>
            <strong>账号列表</strong>
            <span>共 {{ totalUsers }} 条，当前显示第 {{ currentRangeLabel }}</span>
          </div>
          <span class="panel-hint">最后刷新：{{ lastLoadedAt }}</span>
        </div>
      </template>

      <el-table
        :data="users"
        stripe
        row-key="id"
        height="500px"
        v-loading="loading"
        empty-text="暂无匹配数据"
      >
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="210" />
        <el-table-column prop="department" label="部门" min-width="120">
          <template #default="{ row }">
            {{ getDepartmentLabel(row.department) }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" min-width="130">
          <template #default="{ row }">
            {{ getRoleLabel(row.role) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" effect="light">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="150" />
        <el-table-column prop="lastLogin" label="最近登录" min-width="170" />
        <el-table-column label="操作" width="290" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetailDrawer(row)">详情</el-button>
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
            <el-button link type="warning" @click="toggleUserStatus(row)">
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <el-button link type="danger" @click="confirmDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span>{{ pageSummary }}</span>
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[6, 8, 12]"
          :total="totalUsers"
          layout="sizes, prev, pager, next"
          background
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </el-card>

    <UserFormDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :model-value="draftUser"
      :loading="dialogSaving"
      :roles="roleOptions"
      :departments="departmentOptions"
      :statuses="statusOptions"
      @submit="submitUserForm"
      @closed="resetDraftUser"
    />

    <UserDetailDrawer
      v-model:visible="detailVisible"
      :user="activeUser"
      :roles="roleOptions"
      :departments="departmentOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserDetailDrawer from './components/UserDetailDrawer.vue'
import UserFormDialog from './components/UserFormDialog.vue'
import {
  deleteUserRecord,
  fetchUserPageData,
  saveUserRecord,
  toggleUserRecordStatus,
} from '@/mock/user'
import type {
  UserFilters,
  UserFormModel,
  UserMetric,
  UserOption,
  UserPageResult,
  UserRecord,
  UserStatus,
} from '@/types/user'

const loading = ref(false)
const dialogSaving = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const editingId = ref<number | null>(null)
const activeUser = ref<UserRecord | null>(null)
const currentPage = ref(1)
const pageSize = ref(6)
const totalUsers = ref(0)
const lastLoadedAt = ref('--')

const stats = ref<UserMetric[]>([])
const users = ref<UserRecord[]>([])
const roles = ref<UserOption[]>([])
const departments = ref<UserOption[]>([])
const statuses = ref<UserPageResult['statuses']>([])

const filters = reactive<UserFilters>({
  keyword: '',
  status: 'all',
  role: 'all',
  department: 'all',
})

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

const roleOptions = computed(() => roles.value)
const departmentOptions = computed(() => departments.value)
const statusOptions = computed(() => statuses.value)
const currentRangeLabel = computed(() => {
  if (!totalUsers.value) {
    return '0 - 0'
  }

  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalUsers.value)
  return `${start} - ${end}`
})
const pageSummary = computed(() => {
  if (!totalUsers.value) {
    return '当前没有匹配的用户'
  }

  return `当前展示 ${currentRangeLabel.value} 条，共 ${totalUsers.value} 条`
})

const draftUser = ref<UserFormModel>(createEmptyForm())

function createEmptyForm(): UserFormModel {
  return {
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    status: 'active',
    note: '',
  }
}

function createDraftFromRecord(row?: UserRecord): UserFormModel {
  if (!row) {
    return createEmptyForm()
  }

  return {
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department,
    phone: row.phone,
    status: row.status,
    note: row.note,
  }
}

function getRoleLabel(value: string) {
  return roleOptions.value.find((item) => item.value === value)?.label ?? value
}

function getDepartmentLabel(value: string) {
  return departmentOptions.value.find((item) => item.value === value)?.label ?? value
}

function getStatusLabel(value: UserStatus) {
  return statusLabelMap[value]
}

function getStatusTagType(value: UserStatus) {
  return statusTagMap[value]
}

function getCurrentTimeLabel() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

async function loadUsers(page = currentPage.value, size = pageSize.value) {
  loading.value = true
  try {
    const data = await fetchUserPageData({
      keyword: filters.keyword,
      status: filters.status,
      role: filters.role,
      department: filters.department,
      page,
      pageSize: size,
    })

    stats.value = data.stats
    users.value = data.users
    roles.value = data.roles
    departments.value = data.departments
    statuses.value = data.statuses
    totalUsers.value = data.total
    currentPage.value = data.page
    pageSize.value = data.pageSize
    lastLoadedAt.value = getCurrentTimeLabel()
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  currentPage.value = 1
  loadUsers(1, pageSize.value)
}

function reloadUsers() {
  handleSearch()
}

function resetFilters() {
  filters.keyword = ''
  filters.status = 'all'
  filters.role = 'all'
  filters.department = 'all'
  handleSearch()
}

function resetDraftUser() {
  draftUser.value = createEmptyForm()
  editingId.value = null
}

function openCreateDialog() {
  dialogMode.value = 'create'
  editingId.value = null
  draftUser.value = createEmptyForm()
  dialogVisible.value = true
}

function openEditDialog(row: UserRecord) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  draftUser.value = createDraftFromRecord(row)
  dialogVisible.value = true
}

function openDetailDrawer(row: UserRecord) {
  activeUser.value = row
  detailVisible.value = true
}

async function submitUserForm(form: UserFormModel) {
  dialogSaving.value = true
  try {
    await saveUserRecord(form, dialogMode.value, editingId.value)
    ElMessage.success(dialogMode.value === 'create' ? '用户已创建' : '用户信息已更新')
    dialogVisible.value = false
    await loadUsers(dialogMode.value === 'create' ? 1 : currentPage.value, pageSize.value)
  } finally {
    dialogSaving.value = false
  }
}

async function toggleUserStatus(row: UserRecord) {
  const nextStatus: UserStatus = row.status === 'active' ? 'frozen' : 'active'
  const nextLabel = nextStatus === 'active' ? '启用' : '停用'

  try {
    await ElMessageBox.confirm(`确定${nextLabel}「${row.name}」吗？`, '状态变更', {
      type: 'warning',
      confirmButtonText: nextLabel,
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  await toggleUserRecordStatus(row.id, nextStatus)
  ElMessage.success(`已${nextLabel}`)
  await loadUsers(currentPage.value, pageSize.value)
}

async function confirmDelete(row: UserRecord) {
  try {
    await ElMessageBox.confirm(`删除「${row.name}」后不可恢复，继续吗？`, '删除用户', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  await deleteUserRecord(row.id)
  ElMessage.success('用户已删除')
  await loadUsers(currentPage.value, pageSize.value)
}

function handlePageChange(page: number) {
  loadUsers(page, pageSize.value)
}

function handlePageSizeChange(size: number) {
  loadUsers(1, size)
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped lang="scss">
.user-home {
  display: grid;
  gap: 18px;
}

.hero-card {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: linear-gradient(180deg, var(--color-surface-glass), var(--color-surface-muted));
  box-shadow: 0 18px 40px var(--color-shadow-soft);
}

.hero-copy {
  max-width: 700px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.hero-copy h2 {
  margin: 0;
  color: var(--color-text-strong);
  font-size: clamp(26px, 3vw, 40px);
  line-height: 1.1;
}

.hero-copy p {
  max-width: 52ch;
  margin: 12px 0 0;
  color: var(--color-text-muted);
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: 0 12px 28px var(--color-shadow-soft);

  span {
    color: var(--color-text-muted);
    font-size: 12px;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: var(--color-text-strong);
    font-size: 30px;
  }

  small {
    display: inline-block;
    margin-top: 4px;
    color: var(--color-text-muted);
  }
}

.filter-card,
.table-card {
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface-glass);
  box-shadow: 0 12px 30px var(--color-shadow-soft);
}

.filter-grid {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) repeat(3, minmax(0, 1fr)) auto;
  gap: 12px;
  align-items: center;
}

.filter-item {
  min-width: 0;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.panel-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.panel-title > div {
  display: grid;
  gap: 3px;
}

.panel-title strong {
  color: var(--color-text-strong);
}

.panel-hint {
  color: var(--color-text-muted);
  font-size: 12px;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  color: var(--color-text-muted);
  font-size: 12px;
}

@media (max-width: 1120px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-actions {
    justify-content: stretch;
  }

  .hero-card {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .table-footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
