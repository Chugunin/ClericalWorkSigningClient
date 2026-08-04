import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type {
    CreateSigningCertificateRequest,
    SigningCertificate,
} from '#shared/contracts/document-signing/certificate.contracts'
import { documentSigningGateway } from '#server/modules/document-signing/document-signing.gateway'

function isCreateCertificateRequest(
    value: unknown,
): value is CreateSigningCertificateRequest {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const request = value as Record<string, unknown>

    return typeof request.commonName === 'string'
        && typeof request.organization === 'string'
        && typeof request.department === 'string'
        && typeof request.country === 'string'
}

export default defineEventHandler(async (event): Promise<ApiResponse<SigningCertificate>> => {
    const body = await readBody<unknown>(event)

    if (!isCreateCertificateRequest(body)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid certificate creation request',
        })
    }

    return {
        success: true,
        data: await documentSigningGateway.createCertificate(event, body),
    }
})
