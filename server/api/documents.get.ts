import { externalApi } from '../utils/external-api'
import type { ApiResponse } from '~~/shared/types/api/api-response'
import type { Document } from '#shared/types/contracts/responses/documents/document'

export default defineEventHandler(async (event): Promise<ApiResponse<Document[]>> => {
    const documents = await externalApi<Document[]>(
        event,
        '/api/GetDocuments',
    )

    return {
        success: true,
        data: documents ?? [],
    }
})
