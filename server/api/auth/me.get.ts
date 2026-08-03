import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type { CurrentUser } from '#shared/contracts/auth/auth.contracts'
import { authGateway } from '#server/modules/auth/auth.gateway'

export default defineEventHandler(async (event): Promise<ApiResponse<CurrentUser>> => ({
  success: true,
  data: await authGateway.getCurrentUser(event),
}))
