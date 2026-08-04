import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type { SigningCertificate } from '#shared/contracts/document-signing/certificate.contracts'
import { documentSigningGateway } from '#server/modules/document-signing/document-signing.gateway'

export default defineEventHandler(async (event): Promise<ApiResponse<SigningCertificate>> => ({
    success: true,
    data: await documentSigningGateway.getCurrentCertificate(event),
}))
