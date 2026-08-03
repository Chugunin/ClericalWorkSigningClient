import assert from 'node:assert/strict'
import test from 'node:test'

import {
  authenticateSession,
  restoreAuthenticatedSession,
} from '../../app/modules/auth/model/auth-session.ts'
import { getAuthErrorMessage } from '../../app/modules/auth/lib/auth-error.ts'

test('login creates a complete session only after current user is loaded', async () => {
  const calls = []
  const user = { Id: 7, Login: 'tester', FullName: 'Test User', Roles: ['User'] }

  const session = await authenticateSession({
    async login(credentials) {
      calls.push(['login', credentials])
      return { Token: 'token-1' }
    },
    async getCurrentUser(token) {
      calls.push(['getCurrentUser', token])
      return user
    },
  }, { login: 'tester', password: 'secret' })

  assert.deepEqual(calls, [
    ['login', { login: 'tester', password: 'secret' }],
    ['getCurrentUser', 'token-1'],
  ])
  assert.deepEqual(session, { token: 'token-1', user })
})

test('session restore keeps the supplied token and reloads its user', async () => {
  const user = { Id: 9, Login: 'restored', FullName: 'Restored User', Roles: [] }
  const session = await restoreAuthenticatedSession({
    async login() {
      throw new Error('login must not be called during restore')
    },
    async getCurrentUser(token) {
      assert.equal(token, 'stored-token')
      return user
    },
  }, 'stored-token')

  assert.deepEqual(session, { token: 'stored-token', user })
})

test('failed user loading rejects login without returning a partial session', async () => {
  await assert.rejects(
    authenticateSession({
      async login() {
        return { Token: 'unsafe-partial-token' }
      },
      async getCurrentUser() {
        throw new Error('profile unavailable')
      },
    }, { login: 'tester', password: 'secret' }),
    /profile unavailable/,
  )
})

test('auth error mapping prefers API message and has a stable fallback', () => {
  assert.equal(
    getAuthErrorMessage({ data: { message: 'Учётная запись заблокирована' } }),
    'Учётная запись заблокирована',
  )
  assert.equal(
    getAuthErrorMessage(null),
    'Неверный логин или пароль. Проверьте введенные данные.',
  )
})
