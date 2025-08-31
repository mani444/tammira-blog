import { Platform } from 'react-native'
// Read app.json to allow static configuration without extra libs
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - app.json is a JSON file without types
import appJson from '../../app.json'

const DEFAULT_PORT = 4000

function getPort(): number {
  try {
    // Support app.json -> { extra: { apiPort: 4000 } }
    const portFromExtra = (appJson?.extra?.apiPort as number | undefined) ?? undefined
    if (typeof portFromExtra === 'number' && Number.isFinite(portFromExtra)) return portFromExtra
  } catch {}
  return DEFAULT_PORT
}

function getOverrideBaseUrl(): string | undefined {
  try {
    // Support app.json -> { extra: { apiBaseUrl: 'http://...' } }
    const baseFromExtra = (appJson?.extra?.apiBaseUrl as string | undefined) ?? undefined
    if (baseFromExtra && typeof baseFromExtra === 'string') return baseFromExtra
  } catch {}
  // Also allow runtime override (e.g., set in index.js for special runs)
  const fromGlobal = (globalThis as any).__API_BASE_URL__ as string | undefined
  if (fromGlobal && typeof fromGlobal === 'string') return fromGlobal
  return undefined
}

export function getApiBaseUrl() {
  const override = getOverrideBaseUrl()
  if (override) return override

  const port = getPort()
  // Platform-aware defaults:
  // - Android emulator can reach host via 10.0.2.2 without requiring adb reverse
  // - iOS simulator can use localhost
  if (Platform.OS === 'android') return `http://10.0.2.2:${port}`
  return `http://localhost:${port}`
}

