import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = path => readFileSync(
    new URL(`../../${path}`, import.meta.url),
    'utf8',
)

test('PDF signing contract contains serializable placement metadata', () => {
    const source = read(
        'shared/contracts/document-signing/pdf-signing.contracts.ts',
    )

    for (const field of [
        'page: number',
        'x: number',
        'y: number',
        'width: number',
        'height: number',
    ]) {
        assert.match(source, new RegExp(field))
    }

    const sourceWithoutComments = source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')

    assert.doesNotMatch(
        sourceWithoutComments,
        /\bFile\b|Blob|FormData|ArrayBuffer|Ref<|ComputedRef/,
    )
})

test('PDF verification contract preserves API result fields', () => {
    const source = read(
        'shared/contracts/document-signing/pdf-verification.contracts.ts',
    )

    for (const field of [
        'isValid: boolean',
        'signatures: PdfSignatureVerification[]',
        'integrityValid: boolean',
        'certificateTrusted: boolean',
    ]) {
        assert.match(
            source,
            new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        )
    }
})

test('certificate contracts contain current, create and revoke data', () => {
    const source = read(
        'shared/contracts/document-signing/certificate.contracts.ts',
    )

    for (const contract of [
        'SigningCertificate',
        'CreateSigningCertificateRequest',
        'RevokeSigningCertificateRequest',
    ]) {
        assert.match(source, new RegExp(`interface ${contract}`))
    }

    assert.match(source, /reason: string/)
    assert.match(source, /thumbprint: string/)
})

test('document-signing contracts do not depend on application frameworks', () => {
    const sources = [
        read('shared/contracts/document-signing/pdf-signing.contracts.ts'),
        read('shared/contracts/document-signing/pdf-verification.contracts.ts'),
        read('shared/contracts/document-signing/certificate.contracts.ts'),
    ]

    const forbiddenImport =
        /from\s+['"](?:vue|nuxt|pinia|@vue\/|@nuxt\/|#app|~\/|@\/)/

    for (const source of sources) {
        assert.doesNotMatch(source, forbiddenImport)
    }
})