export function getStorageItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  const data = window.localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  const data = JSON.stringify(value)
  window.localStorage.setItem(key, data)
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(key)
} 