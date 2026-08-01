import { apiClient } from './api-client'
import type { Document, DocumentFilters, CreateDocumentRequestData } from '#shared/types'

export const DocumentsApi = {
    async getList(filters?: DocumentFilters | null): Promise<Document[]> {
        const hasActiveFilters = filters && Object.values(filters).some(value => {
            if (Array.isArray(value)) return value.length > 0
            return value !== null && value !== undefined && value !== ''
        })

        if (hasActiveFilters) {
            return await apiClient<Document[]>('/api/documents', {
                method: 'POST',
                body: {
                    action: 'filter',
                    filters: filters
                }
            })
        }

        return await apiClient<Document[]>('/api/documents')
    },

    async create(document: CreateDocumentRequestData): Promise<Document> {
        return await apiClient<Document>('/api/documents', {
            method: 'POST',
            body: {
                action: 'create',
                document
            }
        })
    }
}