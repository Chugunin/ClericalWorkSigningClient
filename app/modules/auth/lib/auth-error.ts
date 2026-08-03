export function getAuthErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object')
    return 'Неверный логин или пароль. Проверьте введенные данные.'

  const candidate = error as {
    data?: { message?: unknown }
    message?: unknown
  }

  if (typeof candidate.data?.message === 'string' && candidate.data.message.trim())
    return candidate.data.message

  if (typeof candidate.message === 'string' && candidate.message.trim())
    return candidate.message

  return 'Неверный логин или пароль. Проверьте введенные данные.'
}
