import { apiClient } from '~/shared/api'

import type { DictionariesResponse } from '#shared/contracts/dictionaries/dictionaries-response.contract'

export const DictionariesApi = {
  getAll(): Promise<DictionariesResponse> {
    return apiClient<DictionariesResponse>('/api/dictionaries')
  },
}
