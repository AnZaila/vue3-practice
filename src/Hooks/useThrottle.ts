export function useThrottle<TArgs extends unknown[]>(fn: (...args: TArgs) => void, delay: number) {
  let lastTime = 0

  return (...args: TArgs) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn(...args)
      lastTime = now
    }
  }
}
