function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T
}

export function mockRequest<T>(data: T, delay = 800): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(cloneData(data)), delay)
  })
}
