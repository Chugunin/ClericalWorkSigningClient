import { defineStore } from 'pinia'

import { DictionariesApi } from '~/api/dictionaries.api'
import { useApiError } from '~/composables/api/useApiError'

import type { DictionariesResponse } from '#shared/types'

export const useDictionariesStore = defineStore('dictionaries', {
    state: () => ({
        data: null as DictionariesResponse | null,
        isLoading: false,
        error: null as string | null,
    }),

    getters: {
        isLoaded: (state) => state.data !== null,

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

            if (this.isLoaded && !force)
                return

            const apiError = useApiError()

            this.isLoading = true
            this.error = null

            try {

                this.data = await DictionariesApi.getAll()

            }
            catch (error) {

                this.error = apiError.getMessage(error)

            }
            finally {

                this.isLoading = false

            }

        },

        clearDictionaries() {

            this.data = null
            this.error = null
            this.isLoading = false

        },

    },

})