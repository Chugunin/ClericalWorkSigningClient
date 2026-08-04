import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const apiPath = '../../app/modules/document-signing/api/document-signing.api.ts'
const apiUrl = new URL(apiPath, import.meta.url)
const source = readFileSync(apiUrl, 'utf8')

test('document-signing browser API exists inside the feature module', () => {
    assert.equal(existsSync(apiUrl), true)
    assert.match(source, /export const DocumentSigningApi/)
})

test('document-signing browser API owns all BFF endpoint strings', () => {
    for (const endpoint of [
        '/api/pdf/sign',
        '/api/pdf/verify',
        '/api/certificates/current',
        '/api/certificates/create',
        '/api/certificates/',
    ]) {
        assert.match(source, new RegExp(endpoint.replaceAll('/', '\\/')))
    }
})

test('JSON operations use the shared apiClient', () => {
    assert.match(source, /import \{ ApiError, apiClient \} from '~\/shared\/api'/)
    assert.match(source, /apiClient<VerifyPdfResponse>/)
    assert.match(source, /apiClient<SigningCertificate>/)
    assert.match(source, /apiClient<(?:void|never)>/)
})

test('signed PDF request uses multipart data and a Blob response', () => {
    assert.match(source, /formData\.append\('file', file, file\.name\)/)
    assert.match(source, /responseType: 'blob'/)
    assert.match(source, /Promise<Blob>/)

    for (const field of ['page', 'x', 'y', 'width', 'height']) {
        assert.match(source, new RegExp(`formData\\.append\\('${field}'`))
    }
})

test('document-signing browser API has no direct external backend URL', () => {
    assert.doesNotMatch(source, /https?:\/\//)
    assert.doesNotMatch(source, /NUXT_SIGNING_API|signingApi/)
})

test('document-signing components do not call fetch directly', () => {
    const componentFiles = [
        'DocumentSigningScreen.vue',
        'DocumentSigningListSection.vue',
        'DocumentSigningMainSection.vue',
        'DocumentSigningWorkspace.vue',
        'DocumentSignatureVerification.vue',
    ]

    for (const file of componentFiles) {
        const component = readFileSync(
            new URL(`../../app/modules/document-signing/components/${file}`, import.meta.url),
            'utf8',
        )

        assert.doesNotMatch(component, /\$fetch|\bfetch\s*\(/)
        assert.doesNotMatch(component, /\/api\/pdf|\/api\/certificates/)
    }
})
