import { externalApi } from '../utils/external-api'
import type { ApiResponse } from '~~/shared/types/api/api-response'
import type { SigningDocument } from '~~/shared/types/data/signing-document'

export default defineEventHandler(async (event): Promise<ApiResponse<SigningDocument[]>> => {
    const documents = await externalApi<SigningDocument[]>(
        event,
        '/api/signing/GetSigningDocuments',
    )

    return {
        success: true,
        data: documents,
    }
})