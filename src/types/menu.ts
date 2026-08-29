export interface MenuNode {
  label: string
  path: string
  icon?: string
  permission?: string
  children?: MenuNode[]
}

export interface MenuResponse {
  menus: MenuNode[]
  permissions: string[]
}
