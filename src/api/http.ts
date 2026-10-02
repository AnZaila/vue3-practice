import axios, { type AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { ApiError, type ApiResult } from '@/types/api'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/utils/token'
import { finishRequestProgress, startRequestProgress } from '@/utils/pageProgress'

const MODE = import.meta.env.VITE_API_MODE ?? 'http'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean; _progress?: boolean }

let refreshing: Promise<string> | null = null

function shouldTrackProgress(url?: string) {
  const path = String(url || '')
  return !path.includes('/ops/notifications') && !path.includes('/auth/captcha')
}

function beginProgress(config: RetryConfig) {
  if (!shouldTrackProgress(config.url) || config._progress) {
    return
  }
  config._progress = true
  startRequestProgress()
}

function endProgress(config?: RetryConfig) {
  if (!config?._progress) {
    return
  }
  config._progress = false
  finishRequestProgress()
}

http.interceptors.request.use(
  (config) => {
    beginProgress(config as RetryConfig)
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['Accept-Language'] = 'zh-CN'
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    endProgress(error?.config as RetryConfig | undefined)
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => {
    endProgress(response.config as RetryConfig)
    const payload = response.data as ApiResult<unknown>
    if (payload && typeof payload.code === 'number' && payload.code !== 0) {
      throw new ApiError(payload.message || '请求失败', payload.code, response.status, payload.data, payload.requestId)
    }
    return payload?.data as never
  },
  async (error: AxiosError<ApiResult<unknown>>) => {
    endProgress(error.config as RetryConfig | undefined)
    const status = error.response?.status ?? 0
    const payload = error.response?.data
    const config = error.config as RetryConfig | undefined
    const message = payload?.message || error.message || '网络异常'
    const code = payload?.code ?? status

    if (
      status === 401 &&
      config &&
      !config._retry &&
      !String(config.url || '').includes('/auth/login') &&
      !String(config.url || '').includes('/auth/refresh') &&
      !String(config.url || '').includes('/auth/captcha')
    ) {
      config._retry = true
      try {
        const next = await silentRefresh()
        config.headers.Authorization = `Bearer ${next}`
        return http(config)
      } catch {
        clearTokens()
        redirectLogin()
      }
    }

    const apiError = new ApiError(message, code, status, payload?.data, payload?.requestId)
    if (status !== 401) {
      ElMessage.error(apiError.message)
    }
    throw apiError
  },
)

async function silentRefresh() {
  if (!refreshing) {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new ApiError('登录已过期', 40001, 401)
    }
    refreshing = axios
      .post<ApiResult<{ accessToken: string; refreshToken: string }>>(
        `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/refresh`,
        { refreshToken },
      )
      .then((res) => {
        const data = res.data.data
        setTokens(data.accessToken, data.refreshToken)
        return data.accessToken
      })
      .finally(() => {
        refreshing = null
      })
  }
  return refreshing
}

function redirectLogin() {
  const redirect = encodeURIComponent(window.location.pathname + window.location.search)
  if (!window.location.pathname.startsWith('/login')) {
    window.location.href = `${import.meta.env.BASE_URL}login?redirect=${redirect}`.replace(/\/{2,}/g, '/')
  }
}

export function request<T>(config: AxiosRequestConfig) {
  return http.request<T, T>(config)
}

export const isMock = MODE === 'mock'
