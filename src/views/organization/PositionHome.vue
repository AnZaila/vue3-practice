<template>
  <div class="org-page" v-loading="loading">
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">ORGANIZATION</span>
        <h2>岗位管理</h2>
        <p>管理岗位等级、编制和所属部门，列表筛选与表单提交都通过 mock 接口完成。</p>
      </div>
      <div class="hero-actions">
        <el-button :loading="loading" @click="reloadPositions">刷新列表</el-button>
        <el-button type="primary" @click="openCreateDialog">新建岗位</el-button>
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
          placeholder="搜索岗位 / 部门 / 说明"
          class="filter-item"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="filters.status" class="filter-item" placeholder="全部状态" @change="handleSearch">
          <el-option label="全部状态" value="all" />
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="filters.level" class="filter-item" placeholder="全部等级" @change="handleSearch">
          <el-option label="全部等级" value="" />
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="filters.department" class="filter-item" placeholder="全部部门" @change="handleSearch">
          <el-option label="全部部门" value="" />
          <el-option
            v-for="item in departmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
            <strong>岗位列表</strong>
            <span>共 {{ totalRows }} 条，当前显示第 {{ currentRangeLabel }}</span>
          </div>
          <span class="panel-hint">最后刷新：{{ lastLoadedAt }}</span>
        </div>
      </template>

      <el-table :data="rows" row-key="id" height="500px" stripe v-loading="loading" empty-text="暂无匹配数据">
        <el-table-column prop="name" label="岗位名称" min-width="160" />
        <el-table-column prop="level" label="等级" width="100" />
        <el-table-column prop="department" label="所属部门" min-width="120" />
        <el-table-column prop="headcount" label="编制" width="100" />
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
            <el-button link type="warning" @click="togglePositionStatus(row)">
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

    <PositionFormDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :model-value="draftPosition"
      :loading="dialogSaving"
      :levels="levelOptions"
      :departments="departmentOptions"
      :statuses="statusOptions"
      @submit="submitPositionForm"
      @closed="resetDraftPosition"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PositionFormDialog from './components/PositionFormDialog.vue'
import {
  deletePositionRecord,
  fetchPositionPageData,
  savePositionRecord,
  togglePositionRecordStatus,
} from '@/mock/organization'
import type {
  OrgOption,
  OrgStatus,
  PositionFormModel,
  PositionPageResult,
  PositionQueryParams,
  PositionRecord,
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

const stats = ref<PositionPageResult['stats']>([])
const rows = ref<PositionRecord[]>([])
const departmentOptions = ref<OrgOption[]>([])
const levelOptions = ref<OrgOption[]>([])
const statusOptions = ref<PositionPageResult['statuses']>([])

const filters = reactive<Pick<PositionQueryParams, 'keyword' | 'status' | 'level' | 'department'>>({
  keyword: '',
  status: 'all',
  level: '',
  department: '',
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
    return '当前没有匹配的岗位'
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

const draftPosition = ref<PositionFormModel>(createEmptyForm())

function createEmptyForm(): PositionFormModel {
  return {
    name: '',
    level: '',
    department: '',
    headcount: 1,
    status: 'active',
    note: '',
  }
}

function createDraftFromRow(row?: PositionRecord): PositionFormModel {
  if (!row) {
    return createEmptyForm()
  }

  return {
    name: row.name,
    level: row.level,
    department: row.department,
    headcount: row.headcount,
    status: row.status,
    note: row.note,
  }
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

async function loadPositions(page = currentPage.value, size = pageSize.value) {
  loading.value = true
  try {
    const data = await fetchPositionPageData({
      keyword: filters.keyword,
      status: filters.status,
      level: filters.level,
      department: filters.department,
      page,
      pageSize: size,
    })

    stats.value = data.stats
    rows.value = data.rows
    totalRows.value = data.total
    departmentOptions.value = data.departments
    levelOptions.value = data.levels
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
  loadPositions(1, pageSize.value)
}

function reloadPositions() {
  handleSearch()
}

function resetFilters() {
  filters.keyword = ''
  filters.status = 'all'
  filters.level = ''
  filters.department = ''
  handleSearch()
}

function resetDraftPosition() {
  draftPosition.value = createEmptyForm()
  editingId.value = null
}

function openCreateDialog() {
  dialogMode.value = 'create'
  editingId.value = null
  draftPosition.value = createEmptyForm()
  dialogVisible.value = true
}

function openEditDialog(row: PositionRecord) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  draftPosition.value = createDraftFromRow(row)
  dialogVisible.value = true
}

async function submitPositionForm(form: PositionFormModel) {
  dialogSaving.value = true
  try {
    await savePositionRecord(form, dialogMode.value, editingId.value)
    ElMessage.success(dialogMode.value === 'create' ? '岗位已创建' : '岗位信息已更新')
    dialogVisible.value = false
    await loadPositions(dialogMode.value === 'create' ? 1 : currentPage.value, pageSize.value)
  } finally {
    dialogSaving.value = false
  }
}

async function togglePositionStatus(row: PositionRecord) {
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

  await togglePositionRecordStatus(row.id, nextStatus)
  ElMessage.success(`已${nextLabel}`)
  await loadPositions(currentPage.value, pageSize.value)
}

async function confirmDelete(row: PositionRecord) {
  try {
    await ElMessageBox.confirm(`删除「${row.name}」后不可恢复，继续吗？`, '删除岗位', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  await deletePositionRecord(row.id)
  ElMessage.success('岗位已删除')
  await loadPositions(currentPage.value, pageSize.value)
}

function handlePageChange(page: number) {
  loadPositions(page, pageSize.value)
}

function handlePageSizeChange(size: number) {
  loadPositions(1, size)
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
