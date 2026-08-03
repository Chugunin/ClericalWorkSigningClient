import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import test from 'node:test'

const root = new URL('../../', import.meta.url)
const read = path => readFile(new URL(path, root), 'utf8')

test('public API exposes only screen, modal and UI model type', async () => {
  const index = await read('app/modules/document-create/index.ts')
  assert.match(index, /DocumentCreateModal/)
  assert.match(index, /DocumentCreateScreen/)
  assert.match(index, /DocumentFormModel/)
  assert.doesNotMatch(index, /DocumentCreateApi|mapDocumentCreateFormToRequest|validateDocumentCreateForm/)
})

test('route and layout consume document-create through public API', async () => {
  const page = await read('app/pages/documents/create.vue')
  const layout = await read('app/layouts/default.vue')
  assert.match(page, /from ['"]~\/modules\/document-create['"]/)
  assert.match(layout, /from ['"]~\/modules\/document-create['"]/)
  assert.doesNotMatch(page + layout, /modules\/document-create\//)
})

test('legacy create-document implementation roots are removed', async () => {
  const documentsDirectory = new URL('app/components/documents/', root)
  if (existsSync(documentsDirectory)) {
    const documentComponents = await readdir(documentsDirectory)
    assert.ok(!documentComponents.includes('create'))
  }
  await assert.rejects(() => read('app/composables/documents/create/useFormDocuments.ts'))
  await assert.rejects(() => read('app/types/documents/create/form-model.ts'))
})

test('document-create depends only on allowed modules', async () => {
  const files = [
    'app/modules/document-create/components/DocumentCreateScreen.vue',
    'app/modules/document-create/components/DocumentCreateFilesSection.vue',
  ]
  const content = (await Promise.all(files.map(read))).join('\n')
  const moduleImports = [...content.matchAll(/~\/modules\/([^/'"]+)/g)].map(match => match[1])
  assert.deepEqual([...new Set(moduleImports)].sort(), ['dictionaries', 'file-viewer'])
})
