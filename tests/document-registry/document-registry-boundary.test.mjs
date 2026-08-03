import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('document-registry exposes only its intended public contract', () => {
  const index = read('app/modules/document-registry/index.ts')
  for (const name of ['DocumentsTable', 'DocumentsFilters', 'useDocuments', 'Document', 'DocumentFilters']) {
    assert.match(index, new RegExp(`\\b${name}\\b`))
  }
  assert.doesNotMatch(index, /DocumentsApi|hasActiveFilters|createEmptyDocumentFilters/)
})

test('legacy registry implementation paths are removed', () => {
  for (const path of [
    'app/api/documents.api.ts',
    'app/composables/api/useDocuments.ts',
    'app/components/documents/list/DocumentsTable.vue',
    'app/components/documents/list/DocumentsFilters.vue',
    'app/utils/document-filters.utils.ts',
  ]) assert.equal(existsSync(new URL(`../../${path}`, import.meta.url)), false, path)
})

test('consumers use the module public API', () => {
  const control = read('app/modules/document-control/components/DocumentControlScreen.vue')
  const dashboard = read('app/modules/personal-dashboard/components/PersonalDashboardScreen.vue')
  assert.match(control, /from '~\/modules\/document-registry'/)
  assert.match(dashboard, /from '~\/modules\/document-registry'/)
  assert.doesNotMatch(control + dashboard, /modules\/document-registry\/(?:api|components|composables|lib|types)/)
})

test('registry API is transport-only and filter decision is isolated', () => {
  const api = read('app/modules/document-registry/api/documents.api.ts')
  assert.match(api, /hasActiveFilters/)
  assert.match(api, /method:\s*'POST'/)
  assert.match(api, /return await apiClient<Document\[]>\('\/api\/documents'\)/)
  assert.doesNotMatch(api, /ref\(|computed\(|useAsyncData/)
})
