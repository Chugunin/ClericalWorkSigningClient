import { externalApi } from '../utils/external-api'
import type { ApiResponse } from '~~/shared/types/api/api-response'
import type { Document } from '#shared/types/contracts/responses/documents/document'
import type {DocumentFilters} from '#shared/types/contracts/requests/filters/document-filters'
import type {CreateDocumentRequestData} from "#shared/types/contracts/requests/documents/create-document-request-data";

export default defineEventHandler(async (event): Promise<ApiResponse<Document[] | Document>> => {
    const body = await readBody<{
        action?: 'filter' | 'create'
        document?: Document
        filter?: DocumentFilters | null
    }>(event)

    if (body?.action === 'create') {
        if (!body.document) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Document payload is required',
            })
        }

        const document = await externalApi<Document>(
            event,
            '/api/actions/CreateDocument',
            {
                method: 'POST',
                body: body.document,
            },
        )

        return {
            success: true,
            data: document,
        }
    }

    const documents = await externalApi<Document[]>(
        event,
        '/api/GetDocuments',
        {
            method: 'POST',
            body: body?.filter ?? null,
        },
    )

    return {
        success: true,
        data: documents ?? [],
    }
})
