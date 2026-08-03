export interface AuthorizationSource {
  authorizationHeader?: string | null
  tokenCookie?: string | null
}

export function resolveAuthorizationHeader(source: AuthorizationSource): string | undefined {
  const header = source.authorizationHeader?.trim()
  if (header) return header

  const token = source.tokenCookie?.trim()
  return token ? `Bearer ${token}` : undefined
}
