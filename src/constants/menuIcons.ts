import type { Component } from 'vue'
import {
  Collection,
  Connection,
  Cpu,
  Document,
  Folder,
  House,
  Key,
  Lock,
  Menu,
  Monitor,
  OfficeBuilding,
  Paperclip,
  Postcard,
  Setting,
  Tickets,
  Tools,
  User,
  UserFilled,
} from '@element-plus/icons-vue'

export const menuIconMap: Record<string, Component> = {
  Collection,
  Connection,
  Cpu,
  Document,
  Folder,
  House,
  Key,
  Lock,
  Menu,
  Monitor,
  OfficeBuilding,
  Paperclip,
  Postcard,
  Setting,
  Tickets,
  Tools,
  User,
  UserFilled,
}

export function resolveMenuIcon(icon?: string) {
  return icon && menuIconMap[icon] ? menuIconMap[icon] : Folder
}
