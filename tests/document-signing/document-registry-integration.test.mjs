import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(
  new URL(`../../${path}`, import.meta.url),
  'utf8',
)

const screen = read(
  'app/modules/document-signing/components/DocumentSigningScreen.vue',
)
const listSection = read(
  'app/modules/document-signing/components/DocumentSigningListSection.vue',
)
const workspace = read(
  'app/modules/document-signing/components/DocumentSigningWorkspace.vue',
)
const fileViewerPublicApi = read(
  'app/modules/file-viewer/index.ts',
)


test('signing screen provides a shared selection context for its local panes', () => {
  assert.match(screen, /provideDocumentSigningSelection\(\)/)
  assert.match(screen, /DocumentSigningListSection/)
  assert.match(screen, /DocumentSigningMainSection/)
})

test('signing list reads documents only through document-registry public API', () => {
  assert.match(listSection, /from '~\/modules\/document-registry'/)
  assert.match(listSection, /useDocuments\(documentFilters/)
  assert.doesNotMatch(listSection, /modules\/document-registry\/(api|components|composables|types)/)
})

test('signing list selects only documents with a physical file reference', () => {
  assert.match(listSection, /document\.Files\?\.some/)
  assert.match(listSection, /file\.FileEntryId/)
  assert.match(listSection, /selectDocument\(document\)/)
})

test('file-viewer exposes physical Blob loading through its public API', () => {
  assert.match(fileViewerPublicApi, /fetchFileBlob/)
})

test('signing workspace loads selected registry files through file-viewer public API', () => {
  assert.match(workspace, /fetchFileBlob/)
  assert.match(workspace, /selectedDocument\.value\?\.Files/)
  assert.match(workspace, /new File\(\[blob\]/)
  assert.doesNotMatch(workspace, /\/api\/files\/physical/)
})

test('signing request carries existing document and file identifiers', () => {
  assert.match(workspace, /documentId:/)
  assert.match(workspace, /fileEntryId:/)
  assert.match(workspace, /DocumentSigningApi\.signPdf/)
})

test('registry integration does not invent signed-file persistence endpoints', () => {
  assert.doesNotMatch(workspace, /replace-file|new-version|save-signed|complete-signing/)
})
