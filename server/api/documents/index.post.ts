import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type { CreateDocumentRequestData } from '#shared/contracts/documents/create-document.request'
import type { Document } from '#shared/contracts/documents/document.contract'
import type { DocumentFilters } from '#shared/contracts/documents/document-filters.contract'
import { documentsGateway } from '#server/modules/documents/documents.gateway'

interface DocumentsCommand {
  action?: 'create' | 'filter'
  document?: CreateDocumentRequestData
  filters?: DocumentFilters | null
}

export default defineEventHandler(async (event): Promise<ApiResponse<Document[] | Document>> => {
  const body = await readBody<DocumentsCommand>(event)

  if (body?.action === 'create') {
    if (!body.document) {
      throw createError({ statusCode: 400, statusMessage: 'Document payload is required' })
    }

    return { success: true, data: await documentsGateway.create(event, body.document) }
  }

  return {
    success: true,
    data: (await documentsGateway.filter(event, body?.filters ?? null)) ?? [],
  }
})
