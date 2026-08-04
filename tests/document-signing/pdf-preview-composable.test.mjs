import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const composablePath = '../../app/modules/document-signing/composables/usePdfPreview.ts'
const composableUrl = new URL(composablePath, import.meta.url)
const source = readFileSync(composableUrl, 'utf8')

test('PDF preview composable exists inside document-signing', () => {
  assert.equal(existsSync(composableUrl), true)
  assert.match(source, /export function usePdfPreview/)
})

test('PDF.js is loaded lazily and only used at the browser boundary', () => {
  assert.match(source, /import\.meta\.server/)
  assert.match(source, /await import\('pdfjs-dist'\)/)
  assert.match(source, /GlobalWorkerOptions\.workerSrc/)
  assert.match(source, /pdf\.worker\.mjs/)
  assert.doesNotMatch(source, /^import .* from 'pdfjs-dist'$/m)
})

test('PDF preview exposes rendering and navigation state', () => {
  for (const token of [
    'pageNumber',
    'pageCount',
    'viewport',
    'isLoading',
    'isRendering',
    'errorMessage',
    'canGoToPreviousPage',
    'canGoToNextPage',
  ]) {
    assert.match(source, new RegExp(token))
  }
})

test('PDF preview renders into canvas and supports page navigation', () => {
  assert.match(source, /getContext\('2d'\)/)
  assert.match(source, /page\.render\(/)
  assert.match(source, /goToPreviousPage/)
  assert.match(source, /goToNextPage/)
  assert.match(source, /setScale/)
})

test('PDF preview cancels stale rendering and releases PDF resources', () => {
  assert.match(source, /renderTask\.value\?\.cancel\(\)/)
  assert.match(source, /currentDocument\.destroy\(\)/)
  assert.match(source, /loadedDocument\.destroy\(\)/)
  assert.match(source, /onScopeDispose/)
  assert.match(source, /loadOperationId/)
  assert.match(source, /renderOperationId/)
})

test('pdfjs-dist is a production dependency', () => {
  const packageJson = JSON.parse(readFileSync(
    new URL('../../package.json', import.meta.url),
    'utf8',
  ))

  assert.equal(
    typeof packageJson.dependencies?.['pdfjs-dist'],
    'string',
  )
})
