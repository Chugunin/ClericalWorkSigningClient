import { apiClient } from '~/shared/api'
import type { Document } from '#shared/contracts/documents/document.contract'
import type { DocumentFilters } from '#shared/contracts/documents/document-filters.contract'
import {hasActiveFilters} from "../lib/document-filters";

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
}