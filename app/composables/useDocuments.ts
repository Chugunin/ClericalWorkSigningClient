import type {Document} from '~~/shared/types/data/document'
import type {ApiResponse} from '~~/shared/types/api/api-response'
import type {DocumentFilters} from '~~/shared/types/filters/document-filters'
import type {Person} from '~~/shared/types/dictionaries/person'

export async function useDocuments() {
    const {data, error, status, refresh} = await useAsyncData(
        'documents',
        () => $fetch<ApiResponse<Document[]>>('/api/documents'),
    )

    const documents = computed<Document[]>(() => {
        if (!data.value?.success) {
            return []
        }

        return data.value.data
    })

    return {
        documents,
        error,
        status,
        refresh,
    }
}

export async function fetchDocumentsByFilter(filters: DocumentFilters) {
    const response = await $fetch<ApiResponse<Document[]>>('/api/documents', {
        method: 'POST',
        body: {
            action: 'filter',
            filter: filters,
        },
    })

    if (!response.success) {
        throw new Error(response.error ?? 'Documents request failed')
    }

    return response.data ?? []
}

export async function createDocument(document: Document) {
    const response = await $fetch<ApiResponse<Document>>('/api/documents', {
        method: 'POST',
        body: {
            action: 'create',
            document,
        },
    })

    if (!response.success) {
        throw new Error(response.error ?? 'Document creation failed')
    }

    return response.data
}
