<template>
  <div class="org-page" v-loading="loading">
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">ORGANIZATION</span>
        <h2>部门管理</h2>
        <p>维护组织结构、负责人和成员规模，所有列表与弹窗均通过 mock 接口获取与提交。</p>
      </div>
      <div class="hero-actions">
        <el-button :loading="loading" @click="reloadDepartments">刷新列表</el-button>
        <el-button type="primary" @click="openCreateDialog">新建部门</el-button>
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
          placeholder="搜索部门 / 负责人 / 联系电话"
          class="filter-item"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="filters.status" class="filter-item" placeholder="全部状态" @change="handleSearch">
          <el-option label="全部状态" value="all" />
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="filters.parent" class="filter-item" placeholder="全部上级部门" @change="handleSearch">
          <el-option label="全部上级部门" value="" />
          <el-option v-for="item in parentOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="filter-actions">
          <el-button @click="resetFilters">重置</el-button>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="panel-title">
          <div>
            <strong>部门列表</strong>
            <span>共 {{ totalRows }} 条，当前显示第 {{ currentRangeLabel }}</span>
          </div>
          <span class="panel-hint">最后刷新：{{ lastLoadedAt }}</span>
        </div>
      </template>

      <el-table :data="rows" row-key="id" height="500px" stripe v-loading="loading" empty-text="暂无匹配数据">
        <el-table-column prop="name" label="部门名称" min-width="160" />
        <el-table-column prop="manager" label="负责人" min-width="120" />
        <el-table-column prop="phone" label="联系电话" min-width="150" />
        <el-table-column prop="parent" label="上级部门" min-width="120">
          <template #default="{ row }">
            {{ getParentLabel(row.parent) }}
          </template>
        </el-table-column>
        <el-table-column prop="memberCount" label="成员数" width="110" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" effect="light">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
            <el-button link type="warning" @click="toggleDepartmentStatus(row)">
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
          :total="totalRows"
          layout="sizes, prev, pager, next"
          background
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </el-card>

    <DepartmentFormDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :model-value="draftDepartment"
      :loading="dialogSaving"
      :parents="parentOptions"
      :statuses="statusOptions"
      @submit="submitDepartmentForm"
      @closed="resetDraftDepartment"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DepartmentFormDialog from './components/DepartmentFormDialog.vue'
import {
  deleteDepartmentRecord,
  fetchDepartmentPageData,
  saveDepartmentRecord,
  toggleDepartmentRecordStatus,
} from '@/mock/organization'
import type {
  DepartmentFormModel,
  DepartmentPageResult,
  DepartmentRecord,
  DepartmentQueryParams,
  OrgOption,
  OrgStatus,
} from '@/types/organization'

const loading = ref(false)
const dialogSaving = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const editingId = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(6)
const totalRows = ref(0)
const lastLoadedAt = ref('--')

const stats = ref<DepartmentPageResult['stats']>([])
const rows = ref<DepartmentRecord[]>([])
const parentOptions = ref<OrgOption[]>([])
const statusOptions = ref<DepartmentPageResult['statuses']>([])

const filters = reactive<Pick<DepartmentQueryParams, 'keyword' | 'status' | 'parent'>>({
  keyword: '',
  status: 'all',
  parent: '',
})

const statusLabelMap: Record<OrgStatus, string> = {
  active: '启用',
  frozen: '停用',
  pending: '待审核',
}

const statusTagMap: Record<OrgStatus, 'success' | 'warning' | 'info'> = {
  active: 'success',
  frozen: 'info',
  pending: 'warning',
}

const pageSummary = computed(() => {
  if (!totalRows.value) {
    return '当前没有匹配的部门'
  }

  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalRows.value)
  return `当前展示 ${start} - ${end} 条，共 ${totalRows.value} 条`
})

const currentRangeLabel = computed(() => {
  if (!totalRows.value) {
    return '0 - 0'
  }

  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalRows.value)
  return `${start} - ${end}`
})

const draftDepartment = ref<DepartmentFormModel>(createEmptyForm())

function createEmptyForm(): DepartmentFormModel {
  return {
    name: '',
    manager: '',
    phone: '',
    parent: '',
    status: 'active',
    note: '',
  }
}

function createDraftFromRow(row?: DepartmentRecord): DepartmentFormModel {
  if (!row) {
    return createEmptyForm()
  }

  return {
    name: row.name,
    manager: row.manager,
    phone: row.phone,
    parent: row.parent,
    status: row.status,
    note: row.note,
  }
}

function getParentLabel(value: string) {
  return parentOptions.value.find((item) => item.value === value)?.label ?? value
}

function getStatusLabel(value: OrgStatus) {
  return statusLabelMap[value]
}

function getStatusTagType(value: OrgStatus) {
  return statusTagMap[value]
}

function getCurrentTimeLabel() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

async function loadDepartments(page = currentPage.value, size = pageSize.value) {
  loading.value = true
  try {
    const data = await fetchDepartmentPageData({
      keyword: filters.keyword,
      status: filters.status,
      parent: filters.parent,
      page,
      pageSize: size,
    })

    stats.value = data.stats
    rows.value = data.rows
    totalRows.value = data.total
    parentOptions.value = data.parents
    statusOptions.value = data.statuses
    currentPage.value = data.page
    pageSize.value = data.pageSize
    lastLoadedAt.value = getCurrentTimeLabel()
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  currentPage.value = 1
  loadDepartments(1, pageSize.value)
}

function reloadDepartments() {
  handleSearch()
}

function resetFilters() {
  filters.keyword = ''
  filters.status = 'all'
  filters.parent = ''
  handleSearch()
}

function resetDraftDepartment() {
  draftDepartment.value = createEmptyForm()
  editingId.value = null
}

function openCreateDialog() {
  dialogMode.value = 'create'
  editingId.value = null
  draftDepartment.value = createEmptyForm()
  dialogVisible.value = true
}

function openEditDialog(row: DepartmentRecord) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  draftDepartment.value = createDraftFromRow(row)
  dialogVisible.value = true
}

async function submitDepartmentForm(form: DepartmentFormModel) {
  dialogSaving.value = true
  try {
    await saveDepartmentRecord(form, dialogMode.value, editingId.value)
    ElMessage.success(dialogMode.value === 'create' ? '部门已创建' : '部门信息已更新')
    dialogVisible.value = false
    await loadDepartments(dialogMode.value === 'create' ? 1 : currentPage.value, pageSize.value)
  } finally {
    dialogSaving.value = false
  }
}

async function toggleDepartmentStatus(row: DepartmentRecord) {
  const nextStatus: OrgStatus = row.status === 'active' ? 'frozen' : 'active'
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

  await toggleDepartmentRecordStatus(row.id, nextStatus)
  ElMessage.success(`已${nextLabel}`)
  await loadDepartments(currentPage.value, pageSize.value)
}

async function confirmDelete(row: DepartmentRecord) {
  try {
    await ElMessageBox.confirm(`删除「${row.name}」后不可恢复，继续吗？`, '删除部门', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  await deleteDepartmentRecord(row.id)
  ElMessage.success('部门已删除')
  await loadDepartments(currentPage.value, pageSize.value)
}

function handlePageChange(page: number) {
  loadDepartments(page, pageSize.value)
}

function handlePageSizeChange(size: number) {
  loadDepartments(1, size)
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped lang="scss">
.org-page {
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
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
  grid-template-columns: minmax(220px, 1.4fr) repeat(2, minmax(0, 1fr)) auto;
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
