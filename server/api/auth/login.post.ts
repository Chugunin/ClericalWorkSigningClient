import type { LoginRequest } from '#shared/contracts/auth/auth.contracts'
import { authGateway } from '#server/modules/auth/auth.gateway'

export default defineEventHandler(async event => {
  return authGateway.login(event, await readBody<LoginRequest>(event))
})
