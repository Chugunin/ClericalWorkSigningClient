import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

test('document-signing exposes only its screen', () => {
  const publicApi = read('app/modules/document-signing/index.ts')
  assert.match(publicApi, /DocumentSigningScreen/)
  assert.doesNotMatch(publicApi, /SigningViewerSection|signing-selection/)
})

test('signing route is a thin adapter through public API', () => {
  const route = read('app/pages/documents/signing.vue')
  assert.match(route, /from '~\/modules\/document-signing'/)
  assert.doesNotMatch(route, /modules\/document-signing\/(components|model|api|composables)/)
})

test('document-signing uses file-viewer only through its public API', () => {
  const viewer = read('app/modules/document-signing/components/DocumentSigningViewerSection.vue')
  assert.match(viewer, /from '~\/modules\/file-viewer'/)
  assert.doesNotMatch(viewer, /~\/modules\/file-viewer\/(components|api|model|composables|lib)/)
})

test('signing screen owns local sections without legacy auto-imports', () => {
  const screen = read('app/modules/document-signing/components/DocumentSigningScreen.vue')
  assert.match(screen, /from '\.\/DocumentSigningListSection\.vue'/)
  assert.match(screen, /from '\.\/DocumentSigningMainSection\.vue'/)
  assert.doesNotMatch(screen, /DocumentsSigning(List|Main)Section/)
})

test('legacy signing component directory is removed', () => {
  assert.equal(existsSync(new URL('../../app/components/documents/signing', import.meta.url)), false)
})

test('signing module has no dependency on document-control', () => {
  const files = [
    'app/modules/document-signing/components/DocumentSigningScreen.vue',
    'app/modules/document-signing/components/DocumentSigningListSection.vue',
    'app/modules/document-signing/components/DocumentSigningMainSection.vue',
    'app/modules/document-signing/components/DocumentSigningViewerSection.vue',
  ]
  for (const file of files) assert.doesNotMatch(read(file), /document-control/)
})

test('document-signing transport contracts stay outside the feature module', () => {
  assert.equal(
      existsSync(
          new URL(
              '../../shared/contracts/document-signing/pdf-signing.contracts.ts',
              import.meta.url,
          ),
      ),
      true,
  )

  assert.equal(
      existsSync(
          new URL(
              '../../shared/contracts/document-signing/pdf-verification.contracts.ts',
              import.meta.url,
          ),
      ),
      true,
  )

  assert.equal(
      existsSync(
          new URL(
              '../../shared/contracts/document-signing/certificate.contracts.ts',
              import.meta.url,
          ),
      ),
      true,
  )

  assert.equal(
      existsSync(
          new URL(
              '../../app/modules/document-signing/contracts',
              import.meta.url,
          ),
      ),
      false,
  )
})
