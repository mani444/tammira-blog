import { Platform } from 'react-native'

const PORT = 4000

export function getApiBaseUrl() {
  // Android emulator cannot use localhost; use host loopback
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
  return `http://${host}:${PORT}`
}

