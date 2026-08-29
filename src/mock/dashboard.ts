import { mockRequest } from './request'
import type { DashboardData } from '@/types/dashboard'

export const dashboardData: DashboardData = {
  metrics: [
    { label: '本周新增用户', value: '326', trend: '+18.2%', trendType: 'up' },
    { label: '待处理工单', value: '47', trend: '-6.4%', trendType: 'down' },
    { label: '接口平均响应', value: '182ms', trend: '-12ms', trendType: 'down' },
    { label: '活跃角色数', value: '14', trend: '+2', trendType: 'up' },
  ],
  tasks: [
    {
      title: '审核新注册企业账号',
      desc: '包含 8 条资料待复核，建议优先完成。',
      tag: '高',
      type: 'danger',
    },
    {
      title: '同步权限策略变更',
      desc: '角色权限需要在今晚发布窗口前确认。',
      tag: '中',
      type: 'warning',
    },
    {
      title: '导出运营日报',
      desc: '数据已完成聚合，待发送给业务负责人。',
      tag: '低',
      type: 'success',
    },
  ],
  traffic: {
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    values: [820, 932, 901, 1134, 1290, 1460, 1386],
  },
  sources: [
    { name: '直接访问', value: 42 },
    { name: '搜索引擎', value: 28 },
    { name: '内容推荐', value: 18 },
    { name: '外部链接', value: 12 },
  ],
  orders: {
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    completed: [120, 132, 101, 134, 90, 230, 210],
    pending: [42, 38, 46, 32, 28, 18, 25],
  },
}

// 用 Promise 模拟接口请求，后续可以直接替换成真实的 request 方法。
export function fetchDashboardData(): Promise<DashboardData> {
  return mockRequest(dashboardData)
}
