export const statusLabel: Record<string, string> = {
  active: '启用',
  frozen: '停用',
  pending: '待审核',
}

export const statusTag: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
  active: 'success',
  frozen: 'info',
  pending: 'warning',
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return '--'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value.replace('T', ' ').slice(0, 19)
  }
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function maskPhone(phone?: string, reveal = false) {
  if (!phone) {
    return '--'
  }
  if (reveal) {
    return phone
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export function maskEmail(email?: string, reveal = false) {
  if (!email) {
    return '--'
  }
  if (reveal) {
    return email
  }
  const [name, domain] = email.split('@')
  if (!domain) {
    return email
  }
  const visible = name.slice(0, 1)
  return `${visible}***@${domain}`
}
