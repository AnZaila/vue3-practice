import { reactive, ref } from 'vue'
import type { PageResult } from '@/types/api'

export function useTableQuery<T, F extends Record<string, unknown>>(options: {
  fetcher: (query: F & { page: number; pageSize: number }) => Promise<PageResult<T>>
  defaultFilters: F
  defaultPageSize?: number
}) {
  const loading = ref(false)
  const items = ref<T[]>([]) as { value: T[] }
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(options.defaultPageSize ?? 10)
  const stats = ref<Record<string, number>>()
  const lastLoadedAt = ref('--')
  const filters = reactive({ ...options.defaultFilters }) as F

  const rangeLabel = () => {
    if (!total.value) {
      return '0 - 0'
    }
    const start = (page.value - 1) * pageSize.value + 1
    const end = Math.min(page.value * pageSize.value, total.value)
    return `${start} - ${end}`
  }

  async function load(nextPage = page.value, nextSize = pageSize.value) {
    loading.value = true
    try {
      const data = await options.fetcher({ ...filters, page: nextPage, pageSize: nextSize })
      items.value = data.items
      total.value = data.total
      page.value = data.page
      pageSize.value = data.pageSize
      stats.value = data.stats
      lastLoadedAt.value = new Intl.DateTimeFormat('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date())
    } finally {
      loading.value = false
    }
  }

  function search() {
    return load(1, pageSize.value)
  }

  function reset(extra?: Partial<F>) {
    Object.assign(filters, options.defaultFilters, extra)
    return search()
  }

  return { loading, items, total, page, pageSize, stats, lastLoadedAt, filters, rangeLabel, load, search, reset }
}
