import assert from 'node:assert/strict'
import {
  existsSync,
  readFileSync,
} from 'node:fs'
import test from 'node:test'

const root = new URL('../../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const exists = path => existsSync(new URL(path, root))

const routes = [
  'server/api/pdf/sign.post.ts',
  'server/api/pdf/verify.post.ts',
  'server/api/certificates/current.get.ts',
  'server/api/certificates/create.post.ts',
  'server/api/certificates/[certificateId]/revoke.post.ts',
]

test('document-signing server gateway and routes exist', () => {
  assert.equal(
    exists('server/modules/document-signing/document-signing.gateway.ts'),
    true,
  )

  for (const route of routes) {
    assert.equal(exists(route), true, `Missing route: ${route}`)
  }
})

test('document-signing gateway uses the shared external API client', () => {
  const source = read(
    'server/modules/document-signing/document-signing.gateway.ts',
  )

  assert.match(source, /requestExternalApi/)
  assert.match(source, /requestExternalFile/)
  assert.match(source, /#server\/shared\/external-api/)
})

test('document-signing routes delegate external access to the gateway', () => {
  for (const route of routes) {
    const source = read(route)

    assert.doesNotMatch(
      source,
      /\$fetch\s*\(|fetch\s*\(|requestExternalApi|requestExternalFile/,
      route,
    )
  }
})

test('document-signing JSON routes use the shared API envelope', () => {
  for (const route of routes.filter(route => route !== 'server/api/pdf/sign.post.ts')) {
    const source = read(route)

    assert.match(source, /ApiResponse</, route)
    assert.match(source, /success:\s*true/, route)
    assert.match(source, /data:/, route)
  }
})
