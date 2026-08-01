import { ref, watch } from 'vue'
import { DocumentsApi } from '~/api/documents.api'
import type { Document, DocumentFilters } from '#shared/types'

export const useDocuments = () => {
    // Реактивные фильтры
    const filters = ref<DocumentFilters>({
        SearchText: '',
        StatusIds: [],
        ExecutorIds: [],
        DateSince: undefined,
        DateTill: undefined
    })

    // Используем useAsyncData для корректного SSR
    const {
        data: documents,
        pending: isLoading,
        error,
        refresh
    } = useAsyncData<Document[]>(
        'documents-list',
        () => DocumentsApi.getList(filters.value),
        {
            default: () => [],
            // watch: [filters] // Можно раскомментировать, если хотите, чтобы таблица обновлялась при каждом чихе в фильтрах
        }
    )

    // Метод для ручного применения фильтров (например, по кнопке "Найти")
    const applyFilters = async () => {
        await refresh()
    }

    // Метод для очистки фильтров
    const clearFilters = async () => {
        filters.value = {
            SearchText: '',
            StatusIds: [],
            ExecutorIds: [],
            DateSince: undefined,
            DateTill: undefined
        }
        await refresh()
    }

    return {
        documents,
        isLoading,
        error,
        filters,
        applyFilters,
        clearFilters,
        refresh
    }
}