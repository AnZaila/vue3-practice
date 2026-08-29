export type OrgStatus = 'active' | 'frozen' | 'pending'

export interface OrgMetric {
  label: string
  value: string
  change: string
}

export interface OrgOption {
  label: string
  value: string
}

export interface DepartmentRecord {
  id: number
  name: string
  manager: string
  phone: string
  memberCount: number
  parent: string
  status: OrgStatus
  createdAt: string
  note: string
}

export interface DepartmentFormModel {
  name: string
  manager: string
  phone: string
  parent: string
  status: OrgStatus
  note: string
}

export interface DepartmentPageResult {
  stats: OrgMetric[]
  rows: DepartmentRecord[]
  total: number
  page: number
  pageSize: number
  parents: OrgOption[]
  statuses: Array<{
    label: string
    value: OrgStatus
  }>
}

export interface DepartmentQueryParams {
  keyword: string
  status: 'all' | OrgStatus
  parent: string
  page: number
  pageSize: number
}

export interface PositionRecord {
  id: number
  name: string
  level: string
  department: string
  headcount: number
  status: OrgStatus
  createdAt: string
  note: string
}

export interface PositionFormModel {
  name: string
  level: string
  department: string
  headcount: number
  status: OrgStatus
  note: string
}

export interface PositionPageResult {
  stats: OrgMetric[]
  rows: PositionRecord[]
  total: number
  page: number
  pageSize: number
  departments: OrgOption[]
  levels: OrgOption[]
  statuses: Array<{
    label: string
    value: OrgStatus
  }>
}

export interface PositionQueryParams {
  keyword: string
  status: 'all' | OrgStatus
  level: string
  department: string
  page: number
  pageSize: number
}
