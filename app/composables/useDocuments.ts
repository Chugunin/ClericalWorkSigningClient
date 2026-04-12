import type { SigningDocument } from '~~/shared/types/data/signing-document'
import type { ApiResponse } from '~~/shared/types/api/api-response'

export async function useDocuments() {
    const { data, error, status, refresh } = await useAsyncData(
        'documents',
        () => $fetch<ApiResponse<SigningDocument[]>>('/api/documents'),
    )

    const documents = computed<SigningDocument[]>(() => {
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