export interface ExternalApiErrorDescriptor {
  statusCode: number
  statusMessage: string
  message: string
}

interface ExternalErrorLike {
  status?: number
  statusCode?: number
  statusText?: string
  statusMessage?: string
  message?: string
  data?: { message?: string; statusMessage?: string } | null
}

export function describeExternalApiError(
  error: unknown,
  fallbackMessage = 'External API request failed',
): ExternalApiErrorDescriptor {
  const value = (error ?? {}) as ExternalErrorLike

  return {
    statusCode: value.statusCode ?? value.status ?? 500,
    statusMessage:
      value.statusMessage
      ?? value.data?.statusMessage
      ?? value.statusText
      ?? fallbackMessage,
    message: value.data?.message ?? value.message ?? fallbackMessage,
  }
}
