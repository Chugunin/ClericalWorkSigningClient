import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const authStorePath = new URL('../../app/modules/auth/model/auth.store.ts', import.meta.url)

test('auth store does not orchestrate dictionaries', async () => {
  const source = await readFile(authStorePath, 'utf8')

  assert.doesNotMatch(source, /dictionaries/i)
  assert.doesNotMatch(source, /useDictionariesStore/)
})
