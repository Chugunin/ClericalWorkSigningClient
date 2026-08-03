import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('public API exposes consumer capabilities but not physical-file internals', () => {
  const publicApi = read('app/modules/file-viewer/index.ts')

  assert.match(publicApi, /FileInlineViewer/)
  assert.match(publicApi, /FileGallery/)
  assert.match(publicApi, /saveFileEntry/)
  assert.doesNotMatch(publicApi, /filesApi/)
  assert.doesNotMatch(publicApi, /loadPhysicalFile/)
  assert.doesNotMatch(publicApi, /createObjectUrlResource/)
})

test('physical file API accepts AbortSignal and does not create object URLs', () => {
  const api = read('app/modules/file-viewer/api/files.api.ts')

  assert.match(api, /signal\?: AbortSignal/)
  assert.match(api, /signal,/)
  assert.doesNotMatch(api, /createObjectURL/)
})

test('viewer components release resources and cancel pending requests', () => {
  for (const component of [
    'app/modules/file-viewer/components/FileInlineViewer.vue',
    'app/modules/file-viewer/components/FileViewer.vue',
  ]) {
    const source = read(component)
    assert.match(source, /\.abort\(\)/)
    assert.match(source, /\.release\(\)/)
  }
})

test('legacy file implementation paths are no longer used', () => {
  const createSection = read('app/modules/document-create/components/DocumentCreateFilesSection.vue')
  const signingSection = read('app/modules/document-signing/components/DocumentSigningViewerSection.vue')

  assert.match(createSection, /from ['"]~\/modules\/file-viewer['"]/)
  assert.match(signingSection, /from ['"]~\/modules\/file-viewer['"]/)
  assert.doesNotMatch(createSection, /~\/composables\/api\/useFileEntries/)
})
