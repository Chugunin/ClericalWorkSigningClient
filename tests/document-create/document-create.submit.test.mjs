import assert from 'node:assert/strict'
import test from 'node:test'

import { createDocumentSubmitter } from '../../app/modules/document-create/model/document-create-submit.ts'

test('submit maps form before calling create API', async () => {
  const calls = []
  const submit = createDocumentSubmitter({
    mapFormToRequest: form => ({ Name: form.name.toUpperCase() }),
    createDocument: async request => {
      calls.push(request)
      return { Id: 1, Name: request.Name }
    },
  })

  const result = await submit({ name: 'test' })
  assert.deepEqual(calls, [{ Name: 'TEST' }])
  assert.equal(result.Name, 'TEST')
})

test('submit propagates API failure', async () => {
  const expected = new Error('create failed')
  const submit = createDocumentSubmitter({
    mapFormToRequest: () => ({ Name: 'test' }),
    createDocument: async () => { throw expected },
  })

  await assert.rejects(() => submit({ name: 'test' }), expected)
})
