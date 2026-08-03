import test from 'node:test'
import assert from 'node:assert/strict'
import { createObjectUrlResource } from '../../app/modules/file-viewer/model/object-url-resource.ts'

test('creates an object URL and exposes normalized MIME type', () => {
  const calls = []
  const urlApi = {
    createObjectURL(blob) {
      calls.push(['create', blob])
      return 'blob:test-resource'
    },
    revokeObjectURL(url) {
      calls.push(['revoke', url])
    },
  }

  const blob = new Blob(['file'], { type: 'application/pdf' })
  const resource = createObjectUrlResource(blob, urlApi)

  assert.equal(resource.url, 'blob:test-resource')
  assert.equal(resource.mimeType, 'application/pdf')
  assert.equal(resource.released, false)
  assert.deepEqual(calls, [['create', blob]])
})

test('release is idempotent and revokes exactly once', () => {
  const revoked = []
  const resource = createObjectUrlResource(new Blob(['file']), {
    createObjectURL: () => 'blob:once',
    revokeObjectURL: url => revoked.push(url),
  })

  resource.release()
  resource.release()

  assert.equal(resource.released, true)
  assert.deepEqual(revoked, ['blob:once'])
})

test('uses application/octet-stream when the Blob has no MIME type', () => {
  const resource = createObjectUrlResource(new Blob(['file']), {
    createObjectURL: () => 'blob:unknown',
    revokeObjectURL: () => undefined,
  })

  assert.equal(resource.mimeType, 'application/octet-stream')
})
