import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { test } from 'node:test'

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

const endpointFiles = [
  'server/api/auth/login.post.ts',
  'server/api/auth/me.get.ts',
  'server/api/dictionaries/index.get.ts',
  'server/api/documents/index.get.ts',
  'server/api/documents/index.post.ts',
  'server/api/files/entries.post.ts',
  'server/api/files/physical/[fileId].get.ts',
]

test('server endpoints are grouped by resources and legacy flat endpoints are removed', () => {
  for (const file of endpointFiles) assert.equal(existsSync(new URL(`../../${file}`, import.meta.url)), true, file)
  for (const file of [
    'server/api/dictionaries.get.ts',
    'server/api/documents.get.ts',
    'server/api/documents.post.ts',
    'server/api/file-entries.post.ts',
    'server/api/physical-file/[fileId].get.ts',
    'server/utils/external-api.utils.ts',
    'server/utils/external-file-api.utils.ts',
  ]) assert.equal(existsSync(new URL(`../../${file}`, import.meta.url)), false, file)
})

test('endpoints delegate external access to gateways', () => {
  for (const file of endpointFiles) {
    const source = read(file)
    assert.doesNotMatch(source, /signingApi|\/api\/GetDocuments|\/api\/actions\/CreateDocument|SaveFileEntry/)
    assert.doesNotMatch(source, /\$fetch\s*\(|fetch\s*\(/)
  }
})

test('external API details are centralized in server shared and gateways', () => {
  const client = read('server/shared/external-api/external-api.client.ts')
  assert.match(client, /resolveAuthorizationHeader/)
  assert.match(client, /describeExternalApiError/)
  assert.doesNotMatch(client, /console\.log/)

  for (const gateway of [
    'server/modules/auth/auth.gateway.ts',
    'server/modules/documents/documents.gateway.ts',
    'server/modules/dictionaries/dictionaries.gateway.ts',
    'server/modules/files/files.gateway.ts',
  ]) {
    assert.match(read(gateway), /#server\/shared\/external-api/)
  }
})

test('server layer never imports client application modules', () => {
  const files = [...endpointFiles,
    'server/shared/external-api/external-api.client.ts',
    'server/modules/auth/auth.gateway.ts',
    'server/modules/documents/documents.gateway.ts',
    'server/modules/dictionaries/dictionaries.gateway.ts',
    'server/modules/files/files.gateway.ts',
  ]
  for (const file of files) assert.doesNotMatch(read(file), /~\/modules|app\/modules/)
})

test('JSON BFF endpoints expose the shared ApiResponse envelope', () => {
  for (const file of [
    'server/api/auth/login.post.ts',
    'server/api/auth/me.get.ts',
    'server/api/dictionaries/index.get.ts',
    'server/api/documents/index.get.ts',
    'server/api/documents/index.post.ts',
    'server/api/files/entries.post.ts',
  ]) {
    const source = read(file)
    assert.match(source, /ApiResponse</, file)
    assert.match(source, /success:\s*true/, file)
    assert.match(source, /data:/, file)
  }
})
