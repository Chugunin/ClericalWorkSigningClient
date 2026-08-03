/**
 * Результат проверки одной электронной подписи.
 */
export interface PdfSignatureVerification {
    signer?: string
    signingTime?: string
    integrityValid: boolean
    certificateTrusted: boolean
    thumbprint?: string
}

/**
 * Общий результат проверки подписанного PDF.
 */
export interface VerifyPdfResponse {
    isValid: boolean
    signatures: PdfSignatureVerification[]
    errorMessage?: string
}