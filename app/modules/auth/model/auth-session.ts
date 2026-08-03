import type { CurrentUser, LoginRequest, LoginResponse } from '#shared/contracts/auth/auth.contracts'

export interface AuthSessionGateway {
  login(credentials: LoginRequest): Promise<LoginResponse>
  getCurrentUser(token: string): Promise<CurrentUser>
}

export interface AuthenticatedSession {
  token: string
  user: CurrentUser
}

export async function authenticateSession(
  gateway: AuthSessionGateway,
  credentials: LoginRequest,
): Promise<AuthenticatedSession> {
  const response = await gateway.login(credentials)
  const user = await gateway.getCurrentUser(response.Token)

  return {
    token: response.Token,
    user,
  }
}

export async function restoreAuthenticatedSession(
  gateway: AuthSessionGateway,
  token: string,
): Promise<AuthenticatedSession> {
  return {
    token,
    user: await gateway.getCurrentUser(token),
  }
}
