import test from 'node:test'
import assert from 'node:assert/strict'

import { createApplicationBootstrap } from '../../app/app/bootstrap/application-bootstrap.ts'

test('restores session before loading startup data', async () => {
  const calls = []
  let user = false

  const bootstrap = createApplicationBootstrap({
    hasToken: () => true,
    hasUser: () => user,
    restoreSession: async () => { calls.push('session'); user = true },
    loadStartupData: async () => { calls.push('startup') },
    clearStartupData: () => {},
    logoutSession: () => {},
  })

  await bootstrap.initialize()

  assert.deepEqual(calls, ['session', 'startup'])
  assert.equal(bootstrap.getStatus(), 'ready')
})

test('is idempotent while initialization is running', async () => {
  let restores = 0
  let release
  let user = false
  const gate = new Promise((resolve) => { release = resolve })

  const bootstrap = createApplicationBootstrap({
    hasToken: () => true,
    hasUser: () => user,
    restoreSession: async () => { restores += 1; await gate; user = true },
    loadStartupData: async () => {},
    clearStartupData: () => {},
    logoutSession: () => {},
  })

  const first = bootstrap.initialize()
  const second = bootstrap.initialize()
  release()
  await Promise.all([first, second])

  assert.equal(restores, 1)
})

test('keeps authenticated session when startup data loading fails', async () => {
  const failure = new Error('dictionaries unavailable')

  const bootstrap = createApplicationBootstrap({
    hasToken: () => true,
    hasUser: () => true,
    restoreSession: async () => {},
    loadStartupData: async () => { throw failure },
    clearStartupData: () => {},
    logoutSession: () => {},
  })

  await bootstrap.initialize()

  assert.equal(bootstrap.getStatus(), 'degraded')
  assert.equal(bootstrap.getStartupDataError(), failure)
})

test('clears startup data before logging out session', async () => {
  const calls = []
  const bootstrap = createApplicationBootstrap({
    hasToken: () => true,
    hasUser: () => true,
    restoreSession: async () => {},
    loadStartupData: async () => {},
    clearStartupData: () => calls.push('clear'),
    logoutSession: () => calls.push('logout'),
  })

  await bootstrap.logout()

  assert.deepEqual(calls, ['clear', 'logout'])
  assert.equal(bootstrap.getStatus(), 'idle')
})
