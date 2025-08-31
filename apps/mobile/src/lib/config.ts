import { Platform } from 'react-native'

const PORT = 4000

export function getApiBaseUrl() {
  // Using adb reverse, so localhost works for both platforms
  return `http://localhost:${PORT}`
}

