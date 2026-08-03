/**
 * Информация об активном сертификате пользователя.
 */
export interface SigningCertificate {
    id: string
    subject: string
    thumbprint: string
    serialNumber: string
    validFrom: string
    validTo: string
    status: string
}

/**
 * Параметры выпуска сертификата.
 */
export interface CreateSigningCertificateRequest {
    commonName: string
    organization: string
    department: string
    country: string
}

/**
 * Параметры отзыва сертификата.
 */
export interface RevokeSigningCertificateRequest {
    reason: string
}