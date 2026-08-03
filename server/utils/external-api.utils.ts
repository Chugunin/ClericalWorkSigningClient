import type {H3Event} from 'h3'
import { getCookie, getHeader } from 'h3'

interface ExternalApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: any
    headers?: Record<string, string>
}

export async function externalApi<T>(
    event: H3Event,
    path: string,
    options: ExternalApiOptions = {},
): Promise<T> {
    
    const config = useRuntimeConfig(event)
    const fetchHeaders = new Headers(options.headers)

    // 1. Проверяем, передал ли клиент токен явно в заголовке (как мы сделали в fetchUser)
    const authHeader = getHeader(event, 'authorization')

    // 2. Проверяем, есть ли токен в сессионной куке (когда работает SSR при обновлении страницы)
    const tokenCookie = getCookie(event, 'auth_token')

    if (authHeader) {
        // Если заголовок есть, он в приоритете (уже содержит слово Bearer)
        fetchHeaders.set('Authorization', authHeader)
    } else if (tokenCookie) {
        // Если заголовка нет, но есть кука, формируем заголовок сами
        fetchHeaders.set('Authorization', `Bearer ${tokenCookie}`)
    }
    
    try {
        const response = await $fetch<T>(path, {
            baseURL: config.signingApi,
            method: options.method ?? 'GET',
            body: options.body,
            headers: Object.fromEntries(fetchHeaders.entries()),
        })

        return response as T
    } catch (error: any) {
        throw createError({
            statusCode: error?.statusCode || 500,
            statusMessage: error?.statusMessage || 'External API request failed',
            message: error?.data?.message || error?.message || 'Unknown error'
        })
    }
}
