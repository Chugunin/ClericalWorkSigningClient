import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type { Document } from '#shared/contracts/documents/document.contract'
import { documentsGateway } from '#server/modules/documents/documents.gateway'

export default defineEventHandler(async (event): Promise<ApiResponse<Document[]>> => ({
  success: true,
  data: (await documentsGateway.list(event)) ?? [],
}))
