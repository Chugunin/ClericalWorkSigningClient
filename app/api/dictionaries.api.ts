import { apiClient } from './api-client'
import type { DictionariesResponse } from '#shared/types'

export const DictionariesApi = {
    async getAll(): Promise<DictionariesResponse> {
        return await apiClient<DictionariesResponse>('/api/dictionaries')
    }
}