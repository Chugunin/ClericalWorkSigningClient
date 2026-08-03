import type { H3Event } from 'h3'
import type { Document } from '#shared/contracts/documents/document.contract'
import type { DocumentFilters } from '#shared/contracts/documents/document-filters.contract'
import type { CreateDocumentRequestData } from '#shared/contracts/documents/create-document.request'
import { requestExternalApi } from '#server/shared/external-api'

export const documentsGateway = {
  list(event: H3Event): Promise<Document[]> {
    return requestExternalApi<Document[]>(event, '/api/GetDocuments')
  },

  filter(event: H3Event, filters: DocumentFilters | null): Promise<Document[]> {
    return requestExternalApi<Document[]>(event, '/api/GetDocuments', {
      method: 'POST',
      body: filters,
    })
  },

  create(event: H3Event, document: CreateDocumentRequestData): Promise<Document> {
    return requestExternalApi<Document>(event, '/api/actions/CreateDocument', {
      method: 'POST',
      body: document,
    })
  },
}
