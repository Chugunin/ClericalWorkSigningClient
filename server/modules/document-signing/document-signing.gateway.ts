import type { H3Event } from 'h3'

import type {
    CreateSigningCertificateRequest,
    RevokeSigningCertificateRequest,
    SigningCertificate,
} from '#shared/contracts/document-signing/certificate.contracts'
import type { VerifyPdfResponse } from '#shared/contracts/document-signing/pdf-verification.contracts'
import {
    requestExternalApi,
    requestExternalFile,
} from '#server/shared/external-api'

const documentSigningPaths = {
    signPdf: '/api/pdf/sign',
    verifyPdf: '/api/pdf/verify',
    currentCertificate: '/api/certificates/current',
    createCertificate: '/api/certificates/create',
    revokeCertificate: (certificateId: string) =>
        `/api/certificates/${encodeURIComponent(certificateId)}/revoke`,
} as const

export const documentSigningGateway = {
    signPdf(
        event: H3Event,
        formData: FormData,
    ): Promise<ArrayBuffer> {
        return requestExternalFile(
            event,
            documentSigningPaths.signPdf,
            {
                method: 'POST',
                body: formData,
            },
        )
    },

    verifyPdf(
        event: H3Event,
        formData: FormData,
    ): Promise<VerifyPdfResponse> {
        return requestExternalApi<VerifyPdfResponse>(
            event,
            documentSigningPaths.verifyPdf,
            {
                method: 'POST',
                body: formData,
            },
        )
    },

    getCurrentCertificate(event: H3Event): Promise<SigningCertificate> {
        return requestExternalApi<SigningCertificate>(
            event,
            documentSigningPaths.currentCertificate,
            { method: 'GET' },
        )
    },

    createCertificate(
        event: H3Event,
        request: CreateSigningCertificateRequest,
    ): Promise<SigningCertificate> {
        return requestExternalApi<SigningCertificate>(
            event,
            documentSigningPaths.createCertificate,
            {
                method: 'POST',
                body: request,
            },
        )
    },

    revokeCertificate(
        event: H3Event,
        certificateId: string,
        request: RevokeSigningCertificateRequest,
    ): Promise<void> {
        return requestExternalApi<never>(
            event,
            documentSigningPaths.revokeCertificate(certificateId),
            {
                method: 'POST',
                body: request,
            },
        )
    },
}
