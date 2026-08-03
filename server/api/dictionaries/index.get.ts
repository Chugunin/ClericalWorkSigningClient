import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type { DictionariesResponse } from '#shared/contracts/dictionaries/dictionaries-response.contract'
import { loadDictionaries } from '#server/modules/dictionaries/dictionaries.gateway'

export default defineEventHandler(async (event): Promise<ApiResponse<DictionariesResponse>> => ({
  success: true,
  data: await loadDictionaries(event),
}))
