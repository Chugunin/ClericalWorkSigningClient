import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { DocumentsApi } from '../api/documents.api'
import type { Document, DocumentFilters } from '../types/document-registry.types'

export interface UseDocumentsOptions {
  scope?: string
}

export function createEmptyDocumentFilters(): DocumentFilters {
  return { SearchText: '', StatusIds: [], ExecutorIds: [], DateSince: undefined, DateTill: undefined }
}

export const useDocuments = (
  externalFilters?: MaybeRefOrGetter<DocumentFilters | null | undefined>,
  options: UseDocumentsOptions = {},
) => {
  const localFilters = ref<DocumentFilters>(createEmptyDocumentFilters())
  const filters = computed(() => externalFilters === undefined ? localFilters.value : (toValue(externalFilters) ?? {}))
  const key = `documents-list:${options.scope ?? 'default'}`

  const { data: documents, pending: isLoading, error, refresh } = useAsyncData<Document[]>(
    key,
    () => DocumentsApi.getList(filters.value),
    { default: () => [] },
  )

  const applyFilters = () => refresh()
  const clearFilters = async () => {
    localFilters.value = createEmptyDocumentFilters()
    await refresh()
  }

  return { documents, isLoading, error, filters: localFilters, applyFilters, clearFilters, refresh }
}
