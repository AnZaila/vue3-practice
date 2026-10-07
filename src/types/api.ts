export interface ApiResult<T> {
  code: number
  message: string
  data: T
  requestId?: string
}

export interface PageResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  stats?: Record<string, number>
}

export interface PageQuery {
  page?: number
  pageSize?: number
}

export class ApiError extends Error {
  code: number
  httpStatus: number
  data?: unknown
  requestId?: string

  constructor(message: string, code: number, httpStatus: number, data?: unknown, requestId?: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.httpStatus = httpStatus
    this.data = data
    this.requestId = requestId
  }
}

export const ErrorCode = {
  OK: 0,
  BAD_REQUEST: 40000,
  UNAUTHORIZED: 40001,
  FORBIDDEN: 40003,
  NOT_FOUND: 40004,
  CONFLICT: 40009,
  VALIDATION: 40022,
} as const
