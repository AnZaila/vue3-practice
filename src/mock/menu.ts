import { mockRequest } from './request'
import type { MenuResponse } from '@/types/menu'

const menuResponse: MenuResponse = {
  menus: [
    {
      label: '工作台',
      path: '/dashboard',
      icon: '◫',
      permission: 'dashboard:view',
    },
    {
      label: '系统管理',
      path: '/system',
      icon: '◪',
      permission: 'system:view',
      children: [
        {
          label: '用户管理',
          path: '/system/user',
          permission: 'system:user:view',
        },
        {
          label: '角色权限',
          path: '/system/role',
          permission: 'system:role:view',
        },
      ],
    },
    {
      label: '组织管理',
      path: '/organization',
      icon: '◫',
      permission: 'organization:view',
      children: [
        {
          label: '部门管理',
          path: '/organization/department',
          permission: 'organization:department:view',
        },
        {
          label: '岗位管理',
          path: '/organization/position',
          permission: 'organization:position:view',
        },
      ],
    },
    {
      label: '我的学习',
      path: '/learning',
      permission: 'learning:view',
      children: [
        {
          label: 'Vue3Learning',
          path: '/learning/Vue3Learning',
          permission: 'learning:ref&Vue3Learning:view',
        },
      ],
    },
  ],
  permissions: [
    'dashboard:view',
    'system:view',
    'system:user:view',
    'system:role:view',
    'organization:view',
    'organization:department:view',
    'organization:position:view',
    'learning:view',
    'learning:Vue3Learning:view',
  ],
}

export function fetchMenuTree(): Promise<MenuResponse> {
  return mockRequest(menuResponse)
}
