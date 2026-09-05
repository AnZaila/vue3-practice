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
