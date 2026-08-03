import { apiClient } from './api-client'
import type { Document, DocumentFilters, CreateDocumentRequestData } from '#shared/types'
import {hasActiveFilters} from "~/utils/filter.utils";

export const DocumentsApi = {
    async getList(filters?: DocumentFilters | null): Promise<Document[]> {

        if (hasActiveFilters(filters)) {
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