import { apiClient } from '~/shared/api'

import type { CreateDocumentRequestData } from '#shared/contracts/documents/create-document.request'
import type { Document } from '#shared/contracts/documents/document.contract'

export const DocumentCreateApi = {
  create(document: CreateDocumentRequestData): Promise<Document> {
    return apiClient<Document>('/api/documents', {
      method: 'POST',
      body: {
        action: 'create',
        document,
      },
    })
  },
}
