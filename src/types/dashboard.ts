export interface DashboardMetric {
  label: string
  value: string
  trend: string
  trendType: 'up' | 'down'
}

export interface DashboardTask {
  title: string
  desc: string
  tag: string
  type: 'danger' | 'warning' | 'success' | 'info'
}

export interface DashboardTraffic {
  days: string[]
  values: number[]
}

export interface DashboardSource {
  name: string
  value: number
}

export interface DashboardOrders {
  days: string[]
  completed: number[]
  pending: number[]
}

export interface DashboardChartTheme {
  muted: string
  strong: string
  border: string
  surface: string
}

export interface DashboardData {
  metrics: DashboardMetric[]
  tasks: DashboardTask[]
  traffic: DashboardTraffic
  sources: DashboardSource[]
  orders: DashboardOrders
}
