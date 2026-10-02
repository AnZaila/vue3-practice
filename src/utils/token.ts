const REFRESH_KEY = 'northstar.refreshToken'

let accessToken = ''

export function getAccessToken() {
  return accessToken
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_KEY) ?? ''
}

export function setTokens(access: string, refresh?: string) {
  accessToken = access
  if (refresh !== undefined) {
    if (refresh) {
      sessionStorage.setItem(REFRESH_KEY, refresh)
    } else {
      sessionStorage.removeItem(REFRESH_KEY)
    }
  }
}

export function clearTokens() {
  accessToken = ''
  sessionStorage.removeItem(REFRESH_KEY)
}
