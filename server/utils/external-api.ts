import type {H3Event} from 'h3'

interface ExternalApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: BodyInit | Record<string, any> | null
    headers?: Record<string, string>
}

export async function externalApi<T>(
    event: H3Event,
    path: string,
    options: ExternalApiOptions = {},
): Promise<T> {
    const config = useRuntimeConfig(event)

    try {
        const response = await $fetch<T>(path, {
            baseURL: config.signingApi,
            method: options.method ?? 'GET',
            body: options.body,
            headers: options.headers,
        })

        return response as T
    } catch (error: unknown) {
        const statusCode =
            typeof error === 'object' &&
            error !== null &&
            'statusCode' in error &&
            typeof (error as { statusCode?: unknown }).statusCode === 'number'
                ? (error as { statusCode: number }).statusCode
                : 500

        const statusMessage =
            typeof error === 'object' &&
            error !== null &&
            'statusMessage' in error &&
            typeof (error as { statusMessage?: unknown }).statusMessage === 'string'
                ? (error as { statusMessage: string }).statusMessage
                : 'External API request failed'

        throw createError({
            statusCode,
            statusMessage,
        })
    }
}
