import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('document-control exposes only its screen', () => {
  const publicApi = read('app/modules/document-control/index.ts')
  assert.match(publicApi, /DocumentControlScreen/)
  assert.doesNotMatch(publicApi, /document-control\.model/)
})

test('route is a thin adapter through public API', () => {
  const route = read('app/pages/documents/control.vue')
  assert.match(route, /from '~\/modules\/document-control'/)
  assert.doesNotMatch(route, /modules\/document-control\/(components|model|api|composables)/)
  assert.doesNotMatch(route, /useDocuments|useDictionariesStore/)
})

test('document-control consumes registry and dictionaries only through public APIs', () => {
  const screen = read('app/modules/document-control/components/DocumentControlScreen.vue')
  assert.match(screen, /from '~\/modules\/document-registry'/)
  assert.match(screen, /from '~\/modules\/dictionaries'/)
  assert.doesNotMatch(screen, /~\/modules\/(document-registry|dictionaries)\/(components|model|api|composables|types)/)
  assert.doesNotMatch(screen, /document-signing/)
})

test('legacy control component path is removed', () => {
  assert.equal(existsSync(new URL('../../app/components/documents/control/ControlScreen.vue', import.meta.url)), false)
})
