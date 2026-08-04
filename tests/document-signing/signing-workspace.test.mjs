import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(
  new URL(`../../${path}`, import.meta.url),
  'utf8',
)

const workspace = read(
  'app/modules/document-signing/components/DocumentSigningWorkspace.vue',
)
const mainSection = read(
  'app/modules/document-signing/components/DocumentSigningMainSection.vue',
)

test('signing workspace composes preview, stamp model and browser API', () => {
  assert.match(workspace, /usePdfPreview/)
  assert.match(workspace, /toPdfSignaturePlacement/)
  assert.match(workspace, /clampSignatureStampPosition/)
  assert.match(workspace, /DocumentSigningApi\.signPdf/)
})

test('signing workspace owns local PDF selection and signed file download', () => {
  assert.match(workspace, /type="file"/)
  assert.match(workspace, /accept="application\/pdf,.pdf"/)
  assert.match(workspace, /URL\.createObjectURL/)
  assert.match(workspace, /_signed\.pdf/)
})

test('signing workspace implements pointer-based bounded stamp dragging', () => {
  assert.match(workspace, /@pointerdown\.prevent="startStampDrag"/)
  assert.match(workspace, /@pointermove\.prevent="moveStamp"/)
  assert.match(workspace, /setPointerCapture/)
  assert.match(workspace, /releasePointerCapture/)
})

test('signing workspace uses authenticated user context without owning login', () => {
  assert.match(workspace, /useAuthStore/)
  assert.match(workspace, /authStore\.user\?\.FullName/)
  assert.doesNotMatch(workspace, /password|AuthApi\.login|\/api\/auth\/login/)
})

test('signing workspace contains no direct transport endpoint strings', () => {
  assert.doesNotMatch(workspace, /\$fetch|\bfetch\s*\(|\/api\/pdf\/sign/)
})

test('main section renders the private signing workspace', () => {
  assert.match(mainSection, /DocumentSigningWorkspace/)
  assert.match(mainSection, /<DocumentSigningWorkspace[^>]*activeTab === 'sign'[^>]*\/>/)
})
