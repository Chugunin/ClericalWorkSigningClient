import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(
  new URL(`../../${path}`, import.meta.url),
  'utf8',
)

const certificateUi = read(
  'app/modules/document-signing/components/DocumentSigningCertificate.vue',
)
const mainSection = read(
  'app/modules/document-signing/components/DocumentSigningMainSection.vue',
)

test('certificate management uses only the module browser API', () => {
  assert.match(certificateUi, /DocumentSigningApi\.getCurrentCertificate\(\)/)
  assert.match(certificateUi, /DocumentSigningApi\.createCertificate\(/)
  assert.match(certificateUi, /DocumentSigningApi\.revokeCertificate\(/)
  assert.doesNotMatch(certificateUi, /\$fetch|\bfetch\s*\(|\/api\/certificates/)
})

test('certificate management handles missing certificate and authenticated user context', () => {
  assert.match(certificateUi, /error instanceof ApiError && error\.status === 404/)
  assert.match(certificateUi, /useAuthStore\(\)/)
  assert.match(certificateUi, /authStore\.user\?\.FullName/)
  assert.match(certificateUi, /commonName: currentUserName\.value/)
})

test('certificate management requires an explicit revoke reason and refreshes state', () => {
  assert.match(certificateUi, /revokeReason\.value\.trim\(\)\.length > 0/)
  assert.match(certificateUi, /reason: revokeReason\.value\.trim\(\)/)
  assert.match(certificateUi, /await loadCertificate\(\)/)
})

test('certificate values are rendered through Vue bindings', () => {
  assert.doesNotMatch(certificateUi, /v-html|innerHTML|insertAdjacentHTML/)
  assert.match(certificateUi, /certificate\.thumbprint/)
  assert.match(certificateUi, /certificate\.serialNumber/)
  assert.match(certificateUi, /formatDate\(certificate\.validFrom\)/)
})

test('main section exposes certificate management as the third local tab', () => {
  assert.match(mainSection, /DocumentSigningCertificate/)
  assert.match(mainSection, /activeTab === 'certificate'/)
  assert.match(mainSection, /Мой сертификат/)
})
