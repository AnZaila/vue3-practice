export interface UserInfo {
  username: string
  password: string
  age: number | null
}

export type InfoDialogMode = 'create' | 'show'

export interface User {
  id?: number
  name: string
  age: number
}

export const userDataShowType: Record<string, string | number>[] = [
  {
    label: 'ID',
    value: 'id',
  },
  {
    label: '部门',
    value: 'name',
  },
  {
    label: '姓名',
    value: 'manager',
  },
  {
    label: '电话',
    value: 'phone',
  },
  {
    label: '父部门',
    value: 'parent',
  },
  {
    label: '状态',
    value: 'status',
  },
  {
    label: '创建时间',
    value: 'createdAt',
  },
  {
    label: '职责',
    value: 'note',
  },
]
