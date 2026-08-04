import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type { VerifyPdfResponse } from '#shared/contracts/document-signing/pdf-verification.contracts'
import { documentSigningGateway } from '#server/modules/document-signing/document-signing.gateway'
import { readRequiredMultipartFormData } from '#server/shared/http/multipart-form-data'

export default defineEventHandler(async (event): Promise<ApiResponse<VerifyPdfResponse>> => {
    const formData = await readRequiredMultipartFormData(event)

    if (!formData.has('file')) {
        throw createError({
            statusCode: 400,
            statusMessage: 'PDF file is required',
        })
    }

    return {
        success: true,
        data: await documentSigningGateway.verifyPdf(event, formData),
    }
})
