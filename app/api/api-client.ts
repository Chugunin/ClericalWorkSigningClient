import type { ApiResponse } from '#shared/types'

export async function apiClient<T>(
    request: string,
    options?: Parameters<typeof $fetch>[1]
): Promise<T> {
    const response = await $fetch<ApiResponse<T>>(request, options)

    if (!response.success) {
        throw new Error(response.error ?? 'API request failed')
    }

    return response.data
}