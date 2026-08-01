import { defineStore } from 'pinia'
import { DictionariesApi } from '~/api/dictionaries.api'
import type { DictionariesResponse } from '#shared/types'

export const useDictionariesStore = defineStore('dictionaries', {
    state: () => ({
        data: null as DictionariesResponse | null,
        isLoading: false,
        error: null as string | null,
    }),

    getters: {
        // Проверка, загружены ли данные
        isLoaded: (state) => state.data !== null,

        // Удобные геттеры для прямого доступа к конкретным массивам (с фоллбеком на пустой массив)
        departments: (state) => state.data?.Departments ?? [],
        persons: (state) => state.data?.Persons ?? [],
        documentFileTypes: (state) => state.data?.DocumentFileTypes ?? [],
        documentStatusTypes: (state) => state.data?.DocumentStatusTypes ?? [],
        documentOriginTypes: (state) => state.data?.DocumentOriginTypes ?? [],
        personDecisionTypes: (state) => state.data?.PersonDecisionTypes ?? [],
        personRightTypes: (state) => state.data?.PersonRightTypes ?? [],
        personRoleTypes: (state) => state.data?.PersonRoleTypes ?? [],
    },

    actions: {
        async fetchDictionaries(force = false) {
            // Если справочники уже в кэше и принудительное обновление не запрошено - просто выходим
            if (this.isLoaded && !force) {
                return
            }

            this.isLoading = true
            this.error = null

            try {
                // Используем чистый API-клиент, который мы сделали на Шаге 2
                this.data = await DictionariesApi.getAll()
            } catch (err: any) {
                this.error = err.message || 'Ошибка при загрузке справочников'
                console.error('[DictionariesStore] Ошибка:', err)
            } finally {
                this.isLoading = false
            }
        },

        clearDictionaries() {
            this.data = null
            this.error = null
        }
    }
})