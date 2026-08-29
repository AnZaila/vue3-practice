export type UserStatus = 'active' | 'frozen' | 'pending'

export interface UserMetric {
  label: string
  value: string
  change: string
}

export interface UserRecord {
  id: number
  name: string
  email: string
  role: string
  department: string
  phone: string
  status: UserStatus
  lastLogin: string
  createdAt: string
  note: string
}

export interface UserOption {
  label: string
  value: string
}

export interface UserPageData {
  stats: UserMetric[]
  users: UserRecord[]
  roles: UserOption[]
  departments: UserOption[]
  statuses: Array<{
    label: string
    value: UserStatus
  }>
}

export interface UserQueryParams {
  keyword: string
  status: 'all' | UserStatus
  role: string
  department: string
  page: number
  pageSize: number
}

export interface UserPageResult {
  stats: UserMetric[]
  users: UserRecord[]
  total: number
  roles: UserOption[]
  departments: UserOption[]
  statuses: Array<{
    label: string
    value: UserStatus
  }>
  page: number
  pageSize: number
}

export interface UserFilters {
  keyword: string
  status: 'all' | UserStatus
  role: string
  department: string
}

export interface UserFormModel {
  name: string
  email: string
  role: string
  department: string
  phone: string
  status: UserStatus
  note: string
}
