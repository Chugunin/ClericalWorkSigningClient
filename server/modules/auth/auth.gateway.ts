import type { H3Event } from 'h3'
import type { CurrentUser, LoginRequest, LoginResponse } from '#shared/contracts/auth/auth.contracts'
import { requestExternalApi } from '#server/shared/external-api'

export const authGateway = {
  login(event: H3Event, credentials: LoginRequest): Promise<LoginResponse> {
    return requestExternalApi<LoginResponse>(event, '/api/auth/login', {
      method: 'POST',
      body: credentials,
    })
  },

  getCurrentUser(event: H3Event): Promise<CurrentUser> {
    return requestExternalApi<CurrentUser>(event, '/api/auth/me')
  },
}
