import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(
  new URL(`../../${path}`, import.meta.url),
  'utf8',
)

const verification = read(
  'app/modules/document-signing/components/DocumentSignatureVerification.vue',
)
const mainSection = read(
  'app/modules/document-signing/components/DocumentSigningMainSection.vue',
)

test('signature verification UI uses the module browser API', () => {
  assert.match(verification, /DocumentSigningApi\.verifyPdf\(file\)/)
  assert.doesNotMatch(verification, /\$fetch|\bfetch\s*\(|\/api\/pdf\/verify/)
})

test('signature verification UI owns PDF selection and explicit states', () => {
  assert.match(verification, /type="file"/)
  assert.match(verification, /accept="application\/pdf,.pdf"/)
  assert.match(verification, /isVerifying/)
  assert.match(verification, /errorMessage/)
  assert.match(verification, /signatures\.length === 0/)
})

test('signature verification output is rendered through Vue bindings', () => {
  assert.doesNotMatch(verification, /v-html|innerHTML|insertAdjacentHTML/)
  assert.match(verification, /signature\.integrityValid/)
  assert.match(verification, /signature\.certificateTrusted/)
  assert.match(verification, /signature\.thumbprint/)
  assert.match(verification, /formatSigningTime/)
})

test('main section exposes signing and verification workspaces as local tabs', () => {
  assert.match(mainSection, /DocumentSigningWorkspace/)
  assert.match(mainSection, /DocumentSignatureVerification/)
  assert.match(mainSection, /activeTab === 'sign'/)
  assert.match(mainSection, /activeTab === 'verify'/)
  assert.match(mainSection, /DocumentSigningCertificate/)
})
