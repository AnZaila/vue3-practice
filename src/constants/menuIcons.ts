import type { Component } from 'vue'
import { Collection, Connection, Folder, House, Setting, User } from '@element-plus/icons-vue'
import type { MenuIconName } from '@/types/menu'

export const menuIconMap: Record<MenuIconName, Component> = {
  Collection,
  Connection,
  Folder,
  House,
  Setting,
  User,
}

export function resolveMenuIcon(icon?: MenuIconName) {
  return icon ? menuIconMap[icon] : Folder
}
