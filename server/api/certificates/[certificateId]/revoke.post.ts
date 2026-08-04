import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type { RevokeSigningCertificateRequest } from '#shared/contracts/document-signing/certificate.contracts'
import { documentSigningGateway } from '#server/modules/document-signing/document-signing.gateway'

function isRevokeCertificateRequest(
    value: unknown,
): value is RevokeSigningCertificateRequest {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const request = value as Record<string, unknown>

    return typeof request.reason === 'string'
        && request.reason.trim().length > 0
}

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
    const certificateId = getRouterParam(event, 'certificateId')

    if (!certificateId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Certificate identifier is required',
        })
    }

    const body = await readBody<unknown>(event)

    if (!isRevokeCertificateRequest(body)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Certificate revoke reason is required',
        })
    }

    await documentSigningGateway.revokeCertificate(
        event,
        certificateId,
        { reason: body.reason.trim() },
    )

    return {
        success: true,
        data: null,
    }
})
