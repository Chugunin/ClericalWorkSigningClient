import type { ApiResponse } from '#shared/contracts/api/api-response.contract'

export class ApiError extends Error {
    readonly status?: number

    constructor(message: string, status?: number) {
        super(message)

        this.name = 'ApiError'
        this.status = status
    }
}

export async function apiClient<T>(
    request: string,
    options?: Parameters<typeof $fetch>[1]
): Promise<T> {
    try {
        const response = await $fetch<ApiResponse<T>>(request, options)

        if (!response.success) {
            throw new ApiError(response.error ?? 'Unknown API error')
        }

        return response.data
    }
    catch (error: any) {
        if (error instanceof ApiError)
            throw error

        throw new ApiError(
            error?.data?.message ??
            error?.message ??
            'Network error',
            error?.status
        )
    }
}