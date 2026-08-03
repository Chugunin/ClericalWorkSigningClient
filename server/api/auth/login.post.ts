import type { ApiResponse } from '#shared/contracts/api/api-response.contract'
import type { LoginRequest, LoginResponse } from '#shared/contracts/auth/auth.contracts'
import { authGateway } from '#server/modules/auth/auth.gateway'

export default defineEventHandler(async (event): Promise<ApiResponse<LoginResponse>> => ({
  success: true,
  data: await authGateway.login(event, await readBody<LoginRequest>(event)),
}))
