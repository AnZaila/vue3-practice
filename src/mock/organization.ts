import { mockRequest } from './request'
import type {
  DepartmentFormModel,
  DepartmentPageResult,
  DepartmentQueryParams,
  DepartmentRecord,
  OrgMetric,
  OrgOption,
  OrgStatus,
  PositionFormModel,
  PositionPageResult,
  PositionQueryParams,
  PositionRecord,
} from '@/types/organization'

const departmentParents: OrgOption[] = [
  { label: '总部', value: 'headquarters' },
  { label: '产品中心', value: 'product' },
  { label: '运营中心', value: 'operation' },
  { label: '技术中心', value: 'engineering' },
]

const departmentStatuses = [
  { label: '启用', value: 'active' as OrgStatus },
  { label: '停用', value: 'frozen' as OrgStatus },
  { label: '待审核', value: 'pending' as OrgStatus },
]

let departmentStore: DepartmentRecord[] = [
  {
    id: 2001,
    name: '产品部',
    manager: '林知远',
    phone: '138-0000-2001',
    memberCount: 18,
    parent: 'headquarters',
    status: 'active',
    createdAt: '2025-10-18 09:10',
    note: '负责产品设计与需求评审',
  },
  {
    id: 2002,
    name: '运营部',
    manager: '周明',
    phone: '138-0000-2002',
    memberCount: 14,
    parent: 'headquarters',
    status: 'active',
    createdAt: '2025-11-02 14:20',
    note: '负责活动、增长和内容运营',
  },
  {
    id: 2003,
    name: '技术部',
    manager: '宋雨',
    phone: '138-0000-2003',
    memberCount: 22,
    parent: 'headquarters',
    status: 'active',
    createdAt: '2025-10-06 16:12',
    note: '负责前后端与基础架构',
  },
  {
    id: 2004,
    name: '内容部',
    manager: '陈果',
    phone: '138-0000-2004',
    memberCount: 9,
    parent: 'operation',
    status: 'pending',
    createdAt: '2026-07-12 10:30',
    note: '待完成组织架构确认',
  },
]

const positionLevels: OrgOption[] = [
  { label: 'P1', value: 'P1' },
  { label: 'P2', value: 'P2' },
  { label: 'P3', value: 'P3' },
  { label: 'P4', value: 'P4' },
]

const positionStatuses = departmentStatuses

let positionStore: PositionRecord[] = [
  {
    id: 3001,
    name: '产品经理',
    level: 'P3',
    department: '产品部',
    headcount: 3,
    status: 'active',
    createdAt: '2025-10-21 09:00',
    note: '负责需求分析与项目协调',
  },
  {
    id: 3002,
    name: '运营专员',
    level: 'P2',
    department: '运营部',
    headcount: 5,
    status: 'active',
    createdAt: '2025-11-08 11:25',
    note: '负责活动执行与日常运营',
  },
  {
    id: 3003,
    name: '前端工程师',
    level: 'P3',
    department: '技术部',
    headcount: 4,
    status: 'active',
    createdAt: '2025-09-16 15:00',
    note: '负责业务前端开发',
  },
  {
    id: 3004,
    name: '测试工程师',
    level: 'P2',
    department: '技术部',
    headcount: 2,
    status: 'frozen',
    createdAt: '2025-12-01 09:40',
    note: '当前冻结，待项目恢复',
  },
]

function cloneDepartments() {
  return departmentStore.map((item) => ({ ...item }))
}

function clonePositions() {
  return positionStore.map((item) => ({ ...item }))
}

function buildStats(items: DepartmentRecord[] | PositionRecord[], kind: 'department' | 'position'): OrgMetric[] {
  if (kind === 'department') {
    const departments = items as DepartmentRecord[]
    return [
      { label: '部门总数', value: String(departments.length), change: '+1 本月' },
      {
        label: '启用部门',
        value: String(departments.filter((item) => item.status === 'active').length),
        change: '+1 本月',
      },
      {
        label: '部门成员',
        value: String(departments.reduce((sum, item) => sum + item.memberCount, 0)),
        change: '+12 本月',
      },
    ]
  }

  const positions = items as PositionRecord[]
  return [
    { label: '岗位总数', value: String(positions.length), change: '+2 本月' },
    {
      label: '启用岗位',
      value: String(positions.filter((item) => item.status === 'active').length),
      change: '+1 本月',
    },
    {
      label: '岗位编制',
      value: String(positions.reduce((sum, item) => sum + item.headcount, 0)),
      change: '+6 本月',
    },
  ]
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length
  const maxPage = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(page, 1), maxPage)
  const start = (currentPage - 1) * pageSize
  return {
    total,
    page: currentPage,
    pageSize,
    rows: items.slice(start, start + pageSize),
  }
}

function formatQueryLabel(value?: string) {
  return value ?? ''
}

function filterDepartments(params: DepartmentQueryParams) {
  const keyword = params.keyword.trim().toLowerCase()
  return cloneDepartments().filter((item) => {
    const matchKeyword =
      !keyword ||
      [item.name, item.manager, item.phone, item.note].some((field) =>
        field.toLowerCase().includes(keyword),
      )
    const matchStatus = params.status === 'all' || item.status === params.status
    const matchParent = !params.parent || item.parent === params.parent
    return matchKeyword && matchStatus && matchParent
  })
}

function filterPositions(params: PositionQueryParams) {
  const keyword = params.keyword.trim().toLowerCase()
  return clonePositions().filter((item) => {
    const matchKeyword =
      !keyword ||
      [item.name, item.department, item.note].some((field) =>
        field.toLowerCase().includes(keyword),
      )
    const matchStatus = params.status === 'all' || item.status === params.status
    const matchLevel = !params.level || item.level === params.level
    const matchDepartment = !params.department || item.department === params.department
    return matchKeyword && matchStatus && matchLevel && matchDepartment
  })
}

function resolveDepartmentQuery(params: Partial<DepartmentQueryParams>): DepartmentQueryParams {
  return {
    keyword: params.keyword ?? '',
    status: params.status ?? 'all',
    parent: params.parent ?? '',
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 6,
  }
}

function resolvePositionQuery(params: Partial<PositionQueryParams>): PositionQueryParams {
  return {
    keyword: params.keyword ?? '',
    status: params.status ?? 'all',
    level: params.level ?? '',
    department: params.department ?? '',
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 6,
  }
}

export async function fetchDepartmentPageData(
  params: Partial<DepartmentQueryParams> = {},
): Promise<DepartmentPageResult> {
  const query = resolveDepartmentQuery(params)
  const filtered = filterDepartments(query)
  const pageData = paginate(filtered, query.page, query.pageSize)

  return mockRequest({
    stats: buildStats(cloneDepartments(), 'department'),
    rows: pageData.rows,
    total: pageData.total,
    page: pageData.page,
    pageSize: pageData.pageSize,
    parents: departmentParents,
    statuses: departmentStatuses,
  })
}

export async function saveDepartmentRecord(
  form: DepartmentFormModel,
  mode: 'create' | 'edit',
  editingId: number | null,
): Promise<void> {
  await mockRequest(null)

  if (mode === 'create') {
    const nextId = Math.max(...departmentStore.map((item) => item.id), 2000) + 1
    departmentStore = [
      {
        id: nextId,
        ...form,
        memberCount: 0,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
      ...departmentStore,
    ]
    return
  }

  if (editingId !== null) {
    departmentStore = departmentStore.map((item) =>
      item.id === editingId ? { ...item, ...form } : item,
    )
  }
}

export async function deleteDepartmentRecord(id: number): Promise<void> {
  await mockRequest(null)
  departmentStore = departmentStore.filter((item) => item.id !== id)
}

export async function toggleDepartmentRecordStatus(id: number, status: OrgStatus): Promise<void> {
  await mockRequest(null)
  departmentStore = departmentStore.map((item) => (item.id === id ? { ...item, status } : item))
}

export async function fetchPositionPageData(
  params: Partial<PositionQueryParams> = {},
): Promise<PositionPageResult> {
  const query = resolvePositionQuery(params)
  const filtered = filterPositions(query)
  const pageData = paginate(filtered, query.page, query.pageSize)

  return mockRequest({
    stats: buildStats(clonePositions(), 'position'),
    rows: pageData.rows,
    total: pageData.total,
    page: pageData.page,
    pageSize: pageData.pageSize,
    departments: cloneDepartments().map((item) => ({ label: item.name, value: item.name })),
    levels: positionLevels,
    statuses: positionStatuses,
  })
}

export async function savePositionRecord(
  form: PositionFormModel,
  mode: 'create' | 'edit',
  editingId: number | null,
): Promise<void> {
  await mockRequest(null)

  if (mode === 'create') {
    const nextId = Math.max(...positionStore.map((item) => item.id), 3000) + 1
    positionStore = [
      {
        id: nextId,
        ...form,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
      ...positionStore,
    ]
    return
  }

  if (editingId !== null) {
    positionStore = positionStore.map((item) =>
      item.id === editingId ? { ...item, ...form } : item,
    )
  }
}

export async function deletePositionRecord(id: number): Promise<void> {
  await mockRequest(null)
  positionStore = positionStore.filter((item) => item.id !== id)
}

export async function togglePositionRecordStatus(id: number, status: OrgStatus): Promise<void> {
  await mockRequest(null)
  positionStore = positionStore.map((item) => (item.id === id ? { ...item, status } : item))
}
