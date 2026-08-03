import assert from 'node:assert/strict'
import test from 'node:test'

import { createDictionariesCache } from '../../app/modules/dictionaries/lib/dictionaries-cache.ts'

test('deduplicates concurrent loads with single-flight', async () => {
  let calls = 0
  let resolveRequest
  const request = new Promise(resolve => { resolveRequest = resolve })
  const cache = createDictionariesCache({
    fetchData: async () => {
      calls += 1
      return request
    },
    getErrorMessage: String,
  })

  const first = cache.load()
  const second = cache.load()
  assert.equal(calls, 1)
  assert.equal(first, second)

  resolveRequest({ value: 1 })
  await first
})

test('returns cached data without an additional request', async () => {
  let calls = 0
  const cache = createDictionariesCache({
    fetchData: async () => ({ value: ++calls }),
    getErrorMessage: String,
  })

  const first = await cache.load()
  const second = await cache.load()

  assert.deepEqual(first, { value: 1 })
  assert.deepEqual(second, { value: 1 })
  assert.equal(calls, 1)
})

test('force reload refreshes cached data', async () => {
  let calls = 0
  const cache = createDictionariesCache({
    fetchData: async () => ({ value: ++calls }),
    getErrorMessage: String,
  })

  await cache.load()
  const refreshed = await cache.load(true)

  assert.deepEqual(refreshed, { value: 2 })
  assert.equal(calls, 2)
})

test('clear resets data, loading and error state', async () => {
  const cache = createDictionariesCache({
    fetchData: async () => { throw new Error('network') },
    getErrorMessage: error => error.message,
  })

  await cache.load()
  assert.equal(cache.getSnapshot().error, 'network')
  cache.clear()

  assert.deepEqual(cache.getSnapshot(), {
    data: null,
    isLoading: false,
    error: null,
  })
})

test('exposes stable error state and permits retry', async () => {
  let calls = 0
  const cache = createDictionariesCache({
    fetchData: async () => {
      calls += 1
      if (calls === 1)
        throw new Error('temporary')
      return { value: 2 }
    },
    getErrorMessage: error => error.message,
  })

  assert.equal(await cache.load(), null)
  assert.equal(cache.getSnapshot().error, 'temporary')
  assert.deepEqual(await cache.load(), { value: 2 })
  assert.equal(cache.getSnapshot().error, null)
})
