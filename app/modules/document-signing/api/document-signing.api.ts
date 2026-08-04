import type {
    CreateSigningCertificateRequest,
    RevokeSigningCertificateRequest,
    SigningCertificate,
} from '#shared/contracts/document-signing/certificate.contracts'
import type { SignPdfRequestData } from '#shared/contracts/document-signing/pdf-signing.contracts'
import type { VerifyPdfResponse } from '#shared/contracts/document-signing/pdf-verification.contracts'

import { ApiError, apiClient } from '~/shared/api'

const documentSigningEndpoints = {
    signPdf: '/api/pdf/sign',
    verifyPdf: '/api/pdf/verify',
    currentCertificate: '/api/certificates/current',
    createCertificate: '/api/certificates/create',
    revokeCertificate: (certificateId: string) =>
        `/api/certificates/${encodeURIComponent(certificateId)}/revoke`,
} as const

interface FetchErrorPayload {
    data?: {
        message?: string
        statusMessage?: string
    }
    message?: string
    status?: number
    statusCode?: number
}

function isFetchErrorPayload(error: unknown): error is FetchErrorPayload {
    return typeof error === 'object' && error !== null
}

function normalizeFetchError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error
    }

    if (isFetchErrorPayload(error)) {
        return new ApiError(
            error.data?.message
            ?? error.data?.statusMessage
            ?? error.message
            ?? 'Network error',
            error.status ?? error.statusCode,
        )
    }

    return new ApiError('Network error')
}

function appendSignRequestData(
    formData: FormData,
    request: SignPdfRequestData,
): void {
    formData.append('page', String(request.page))
    formData.append('x', String(request.x))
    formData.append('y', String(request.y))
    formData.append('width', String(request.width))
    formData.append('height', String(request.height))

    if (request.documentId) {
        formData.append('documentId', request.documentId)
    }

    if (request.fileEntryId) {
        formData.append('fileEntryId', request.fileEntryId)
    }
}

async function requestSignedPdf(
    file: File,
    request: SignPdfRequestData,
): Promise<Blob> {
    const formData = new FormData()
    formData.append('file', file, file.name)
    appendSignRequestData(formData, request)

    try {
        return await $fetch<Blob>(documentSigningEndpoints.signPdf, {
            method: 'POST',
            body: formData,
            responseType: 'blob',
        })
    }
    catch (error: unknown) {
        throw normalizeFetchError(error)
    }
}

export const DocumentSigningApi = {
    signPdf(
        file: File,
        request: SignPdfRequestData,
    ): Promise<Blob> {
        return requestSignedPdf(file, request)
    },

    verifyPdf(file: File): Promise<VerifyPdfResponse> {
        const formData = new FormData()
        formData.append('file', file, file.name)

        return apiClient<VerifyPdfResponse>(
            documentSigningEndpoints.verifyPdf,
            {
                method: 'POST',
                body: formData,
            },
        )
    },

    getCurrentCertificate(): Promise<SigningCertificate> {
        return apiClient<SigningCertificate>(
            documentSigningEndpoints.currentCertificate,
        )
    },

    createCertificate(
        request: CreateSigningCertificateRequest,
    ): Promise<SigningCertificate> {
        return apiClient<SigningCertificate>(
            documentSigningEndpoints.createCertificate,
            {
                method: 'POST',
                body: request,
            },
        )
    },

    revokeCertificate(
        certificateId: string,
        request: RevokeSigningCertificateRequest,
    ): Promise<void> {
        return apiClient<never>(
            documentSigningEndpoints.revokeCertificate(certificateId),
            {
                method: 'POST',
                body: request,
            },
        )
    },
}
