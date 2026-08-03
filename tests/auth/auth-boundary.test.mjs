import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'

const root = resolve(import.meta.dirname, '../..')
const read = path => readFileSync(resolve(root, path), 'utf8')

test('auth public API exposes only the screen and session store', () => {
  const publicApi = read('app/modules/auth/index.ts')

  assert.match(publicApi, /AuthLoginScreen/)
  assert.match(publicApi, /useAuthStore/)
  assert.doesNotMatch(publicApi, /AuthApi|authenticateSession|getAuthErrorMessage|LoginRequest|LoginResponse/)
})

test('auth module is independent from other business modules', () => {
  const files = [
    'app/modules/auth/api/auth.api.ts',
    'app/modules/auth/components/AuthLoginScreen.vue',
    'app/modules/auth/lib/auth-error.ts',
    'app/modules/auth/model/auth-session.ts',
    'app/modules/auth/model/auth.store.ts',
  ]
  const source = files.map(read).join('\n')

  assert.doesNotMatch(source, /modules\/(?:dictionaries|documents|file-viewer)|stores\/dictionaries|api\/documents|api\/files/)
})

test('route and middleware consume auth through its public API', () => {
  const source = [read('app/pages/login.vue'), read('app/middleware/auth.global.ts')].join('\n')

  assert.match(source, /~\/modules\/auth['"]/)
  assert.doesNotMatch(source, /modules\/auth\/(?:api|components|lib|model)/)
})
