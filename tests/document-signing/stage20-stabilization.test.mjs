import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const root = new URL('../../', import.meta.url)
const exists = path => existsSync(new URL(path, root))
const read = path => readFileSync(new URL(path, root), 'utf8')

test('obsolete static signing viewer and selection model are removed', () => {
  assert.equal(exists('app/modules/document-signing/components/DocumentSigningViewerSection.vue'), false)
  assert.equal(exists('app/modules/document-signing/model/signing-selection.ts'), false)
  assert.equal(exists('tests/document-signing/signing-selection.test.mjs'), false)
})

test('document-signing public API remains screen-only', () => {
  const source = read('app/modules/document-signing/index.ts')
  assert.match(source, /DocumentSigningScreen/)
  assert.doesNotMatch(source, /Workspace|Verification|Certificate|usePdfPreview|DocumentSigningApi/)
})

test('final signing screen has no static document identifiers', () => {
  const source = [
    read('app/modules/document-signing/components/DocumentSigningScreen.vue'),
    read('app/modules/document-signing/components/DocumentSigningListSection.vue'),
    read('app/modules/document-signing/components/DocumentSigningWorkspace.vue'),
  ].join('\n')

  assert.doesNotMatch(source, /019db3e8|019db451|019dbfcf/)
  assert.doesNotMatch(source, /test1|test2|test3/)
})

test('signed-file persistence is not simulated by the frontend', () => {
  const source = read('app/modules/document-signing/components/DocumentSigningWorkspace.vue')
  assert.doesNotMatch(source, /replace-file|save-signed|new-version|complete-signing|update-status/)
  assert.match(source, /DocumentSigningApi\.signPdf/)
})
