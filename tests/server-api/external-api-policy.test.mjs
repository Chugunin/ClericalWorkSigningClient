import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveAuthorizationHeader } from '../../server/shared/external-api/authorization-forwarding.ts'
import { describeExternalApiError } from '../../server/shared/external-api/external-api-error.ts'

test('explicit authorization header has priority over auth cookie', () => {
  assert.equal(resolveAuthorizationHeader({ authorizationHeader: 'Bearer header', tokenCookie: 'cookie' }), 'Bearer header')
})

test('auth cookie is normalized into Bearer header', () => {
  assert.equal(resolveAuthorizationHeader({ tokenCookie: ' token ' }), 'Bearer token')
  assert.equal(resolveAuthorizationHeader({}), undefined)
})

test('external error keeps upstream status and message', () => {
  assert.deepEqual(describeExternalApiError({ statusCode: 404, statusMessage: 'Not Found', data: { message: 'Missing' } }), {
    statusCode: 404,
    statusMessage: 'Not Found',
    message: 'Missing',
  })
})

test('unknown external error receives stable fallback', () => {
  assert.deepEqual(describeExternalApiError(null), {
    statusCode: 500,
    statusMessage: 'External API request failed',
    message: 'External API request failed',
  })
})
