import type {Document} from '#shared/types/contracts/responses/documents/document'
import type {ApiResponse} from '#shared/types/api/api-response'
import type {CreateDocumentRequestData} from "#shared/types/contracts/requests/documents/create-document-request-data";
import type {DocumentFilters} from "#shared/types/contracts/requests/filters/document-filters";

function buildDocumentsKey(filters?: DocumentFilters, scope = 'default') {
    return `documents:${scope}:${JSON.stringify(normalizeFilters(filters))}`
}

function hasActiveFilters(filters?: DocumentFilters) {
    if (!filters) {
        return false
    }

    return Object.values(filters).some(value => {
        if (Array.isArray(value)) {
            return value.length > 0
        }

        return value !== null && value !== undefined && value !== ''
    })
}

function normalizeFilters(filters?: DocumentFilters) {
    if (!filters) {
        return null
    }

    const normalizedEntries = Object.entries(filters)
        .filter(([, value]) => {
            if (Array.isArray(value)) {
                return value.length > 0
            }

            return value !== null && value !== undefined && value !== ''
        })
        .sort(([a], [b]) => a.localeCompare(b))

    return Object.fromEntries(normalizedEntries)
}

async function requestDocuments(filters?: DocumentFilters) {
    const response = hasActiveFilters(filters)
        ? await $fetch<ApiResponse<Document[]>>('/api/documents', {
            method: 'POST',
            body: {
                action: 'filter',
                filters: filters,
            },
        })
        : await $fetch<ApiResponse<Document[]>>('/api/documents')

    if (!response.success) {
        throw new Error(response.error ?? 'Documents request failed')
    }

    return response.data ?? []
}

export async function createDocument(document: CreateDocumentRequestData) {
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

export async function useDocuments(
    filters?: MaybeRefOrGetter<DocumentFilters | undefined>,
    options?: {
        scope?: string
        lazy?: boolean
        immediate?: boolean
    },
) {
    const resolvedFilters = computed(() => toValue(filters))
    const scope = options?.scope ?? 'default'
    const key = computed(() => buildDocumentsKey(resolvedFilters.value, scope))

    const { data, error, status, refresh, clear } = await useAsyncData(
        key,
        () => requestDocuments(resolvedFilters.value),
        {
            default: () => [],
            lazy: options?.lazy,
            immediate: options?.immediate,
            watch: [resolvedFilters],
        },
    )

    const documents = computed<Document[]>(() => data.value ?? [])

    return {
        documents,
        error,
        status,
        refresh,
        clear,
        key,
    }
}