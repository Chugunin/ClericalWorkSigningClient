import type { ApiResponse } from '~~/shared/types/api/api-response'

export async function useApi<T>(url: string, options?: Parameters<typeof $fetch<ApiResponse<T>>>[1]) {
    const response = await $fetch<ApiResponse<T>>(url, options)

    if (!response.success) {
        throw new Error(response.error ?? 'API request failed')
    }

    return response.data
}