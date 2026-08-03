import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('personal-dashboard exposes only its screen', () => {
  const publicApi = read('app/modules/personal-dashboard/index.ts')
  assert.match(publicApi, /PersonalDashboardScreen/)
  assert.doesNotMatch(publicApi, /personal-dashboard\.model|status-colors|PersonalDashboardCard/)
})

test('private route remains a thin compatibility adapter', () => {
  const route = read('app/pages/documents/private.vue')
  assert.match(route, /from '~\/modules\/personal-dashboard'/)
  assert.match(route, /PersonalDashboardScreen/)
  assert.doesNotMatch(route, /modules\/personal-dashboard\/(components|model|types)/)
})

test('dashboard consumes registry and dictionaries through public APIs', () => {
  const screen = read('app/modules/personal-dashboard/components/PersonalDashboardScreen.vue')
  assert.match(screen, /from '~\/modules\/document-registry'/)
  assert.match(screen, /from '~\/modules\/dictionaries'/)
  assert.doesNotMatch(screen, /~\/modules\/(document-registry|dictionaries)\/(components|model|api|types)/)
})

test('legacy private implementation and global dashboard types are removed', () => {
  assert.equal(existsSync(new URL('../../app/components/documents/private', import.meta.url)), false)
  assert.equal(existsSync(new URL('../../app/types/documents/private', import.meta.url)), false)
  assert.equal(existsSync(new URL('../../app/utils/color.ts', import.meta.url)), false)
})

test('aggregation is separated from Vue screen rendering', () => {
  const screen = read('app/modules/personal-dashboard/components/PersonalDashboardScreen.vue')
  const model = read('app/modules/personal-dashboard/model/personal-dashboard.model.ts')
  assert.match(screen, /buildPersonalDashboardModel/)
  assert.doesNotMatch(model, /from ['"]vue['"]|computed\(|ref\(/)
})
