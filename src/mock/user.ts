import { mockRequest } from './request'
import type {
  UserFilters,
  UserFormModel,
  UserPageResult,
  UserQueryParams,
  UserRecord,
  UserStatus,
} from '@/types/user'

const baseStats = [
  { label: '总用户数', value: '128', change: '+12 本月' },
  { label: '启用账号', value: '121', change: '+9 本月' },
  { label: '待审核账号', value: '7', change: '-2 本周' },
  { label: '冻结账号', value: '4', change: '-1 本周' },
]

const roles = [
  { label: '超级管理员', value: 'super_admin' },
  { label: '运营经理', value: 'ops_manager' },
  { label: '内容审核', value: 'reviewer' },
  { label: '普通成员', value: 'member' },
]

const departments = [
  { label: '产品部', value: 'product' },
  { label: '运营部', value: 'operation' },
  { label: '技术部', value: 'engineering' },
  { label: '内容部', value: 'content' },
]

const statuses = [
  { label: '启用', value: 'active' as UserStatus },
  { label: '停用', value: 'frozen' as UserStatus },
  { label: '待审核', value: 'pending' as UserStatus },
]

let userStore: UserRecord[] = [
  {
    id: 1001,
    name: '林知远',
    email: 'lin@northstar.cn',
    role: 'super_admin',
    department: 'engineering',
    phone: '138-0000-1001',
    status: 'active',
    lastLogin: '2026-08-29 09:24',
    createdAt: '2025-11-04 14:20',
    note: '平台最高权限账号',
  },
  {
    id: 1002,
    name: '周明',
    email: 'zhou@northstar.cn',
    role: 'ops_manager',
    department: 'operation',
    phone: '138-0000-1002',
    status: 'active',
    lastLogin: '2026-08-28 18:12',
    createdAt: '2026-01-13 09:05',
    note: '负责活动与数据运营',
  },
  {
    id: 1003,
    name: '宋雨',
    email: 'song@northstar.cn',
    role: 'reviewer',
    department: 'content',
    phone: '138-0000-1003',
    status: 'pending',
    lastLogin: '2026-08-25 10:01',
    createdAt: '2026-08-12 11:16',
    note: '待完成身份复核',
  },
  {
    id: 1004,
    name: '陈果',
    email: 'chen@northstar.cn',
    role: 'member',
    department: 'product',
    phone: '138-0000-1004',
    status: 'active',
    lastLogin: '2026-08-29 08:33',
    createdAt: '2026-02-24 15:48',
    note: '日常成员账号',
  },
  {
    id: 1005,
    name: '赵琳',
    email: 'zhao@northstar.cn',
    role: 'member',
    department: 'operation',
    phone: '138-0000-1005',
    status: 'frozen',
    lastLogin: '2026-08-15 12:02',
    createdAt: '2026-03-09 10:14',
    note: '账号已冻结待处理',
  },
  {
    id: 1006,
    name: '刘思',
    email: 'liu@northstar.cn',
    role: 'reviewer',
    department: 'content',
    phone: '138-0000-1006',
    status: 'active',
    lastLogin: '2026-08-28 21:48',
    createdAt: '2026-04-18 13:38',
    note: '晚间审核排班',
  },
  {
    id: 1007,
    name: '郑凯',
    email: 'zheng@northstar.cn',
    role: 'ops_manager',
    department: 'operation',
    phone: '138-0000-1007',
    status: 'active',
    lastLogin: '2026-08-27 16:19',
    createdAt: '2026-05-20 09:10',
    note: '负责活动协同',
  },
  {
    id: 1008,
    name: '何宁',
    email: 'he@northstar.cn',
    role: 'member',
    department: 'engineering',
    phone: '138-0000-1008',
    status: 'pending',
    lastLogin: '2026-08-20 15:55',
    createdAt: '2026-08-08 17:42',
    note: '新入职未完成审批',
  },
]

function cloneUsers() {
  return userStore.map((item) => ({ ...item }))
}

function filterUsers(params: UserQueryParams) {
  const keyword = params.keyword.trim().toLowerCase()

  return cloneUsers().filter((user) => {
    const matchKeyword =
      !keyword ||
      [user.name, user.email, user.phone].some((field) => field.toLowerCase().includes(keyword))
    const matchStatus = params.status === 'all' || user.status === params.status
    const matchRole = params.role === 'all' || user.role === params.role
    const matchDepartment = params.department === 'all' || user.department === params.department

    return matchKeyword && matchStatus && matchRole && matchDepartment
  })
}

function paginate(users: UserRecord[], page: number, pageSize: number) {
  const total = users.length
  const maxPage = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(page, 1), maxPage)
  const start = (currentPage - 1) * pageSize

  return {
    total,
    page: currentPage,
    pageSize,
    users: users.slice(start, start + pageSize),
  }
}

function getStats(): UserPageResult['stats'] {
  return [
    { label: '总用户数', value: String(userStore.length), change: '+12 本月' },
    {
      label: '启用账号',
      value: String(userStore.filter((item) => item.status === 'active').length),
      change: '+9 本月',
    },
    {
      label: '待审核账号',
      value: String(userStore.filter((item) => item.status === 'pending').length),
      change: '-2 本周',
    },
    {
      label: '冻结账号',
      value: String(userStore.filter((item) => item.status === 'frozen').length),
      change: '-1 本周',
    },
  ]
}

function resolveQuery(params: Partial<UserQueryParams>): UserQueryParams {
  return {
    keyword: params.keyword ?? '',
    status: params.status ?? 'all',
    role: params.role ?? 'all',
    department: params.department ?? 'all',
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 6,
  }
}

export async function fetchUserPageData(params: Partial<UserQueryParams> = {}): Promise<UserPageResult> {
  const query = resolveQuery(params)
  const filteredUsers = filterUsers(query)
  const pageData = paginate(filteredUsers, query.page, query.pageSize)

  return mockRequest({
    stats: getStats(),
    users: pageData.users,
    total: pageData.total,
    roles,
    departments,
    statuses,
    page: pageData.page,
    pageSize: pageData.pageSize,
  })
}

export async function saveUserRecord(
  form: UserFormModel,
  mode: 'create' | 'edit',
  editingId: number | null,
): Promise<void> {
  await mockRequest(null)

  if (mode === 'create') {
    const nextId = Math.max(...userStore.map((item) => item.id), 1000) + 1
    userStore = [
      {
        id: nextId,
        ...form,
        lastLogin: '刚创建',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
      ...userStore,
    ]
    return
  }

  if (editingId !== null) {
    userStore = userStore.map((item) => (item.id === editingId ? { ...item, ...form } : item))
  }
}

export async function toggleUserRecordStatus(id: number, status: UserStatus): Promise<void> {
  await mockRequest(null)
  userStore = userStore.map((item) => (item.id === id ? { ...item, status } : item))
}

export async function deleteUserRecord(id: number): Promise<void> {
  await mockRequest(null)
  userStore = userStore.filter((item) => item.id !== id)
}
