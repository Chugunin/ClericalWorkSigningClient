import type { H3Event } from 'h3'
import {
    createError,
    getCookie,
    getHeader,
} from 'h3'
import {
    $fetch,
    type FetchOptions,
} from 'ofetch'

import { resolveAuthorizationHeader } from './authorization-forwarding'
import { describeExternalApiError } from './external-api-error'

type JsonFetchOptions = FetchOptions<'json'>
type ArrayBufferFetchOptions = FetchOptions<'arrayBuffer'>

export type ExternalApiRequestOptions = Omit<
    JsonFetchOptions,
    'baseURL' | 'headers' | 'responseType'
> & {
    headers?: JsonFetchOptions['headers']
}

export type ExternalFileRequestOptions = Omit<
    ArrayBufferFetchOptions,
    'baseURL' | 'headers' | 'responseType'
> & {
    headers?: ArrayBufferFetchOptions['headers']
}

function getExternalApiContext(event: H3Event) {
    const config = useRuntimeConfig(event)
    const baseURL = String(config.signingApi ?? '').replace(/\/+$/, '')

    if (!baseURL) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Signing API URL is not configured',
        })
    }

    const authorization = resolveAuthorizationHeader({
        authorizationHeader: getHeader(event, 'authorization'),
        tokenCookie: getCookie(event, 'auth_token'),
    })

    return {
        baseURL,
        authorization,
    }
}

function createHeaders(
    authorization: string | undefined,
    headers: FetchOptions['headers'],
): Headers {
    const result = new Headers(headers)

    if (authorization && !result.has('authorization')) {
        result.set('authorization', authorization)
    }

    return result
}

export async function requestExternalApi<T>(
    event: H3Event,
    path: string,
    options: ExternalApiRequestOptions = {},
): Promise<T> {
    const { baseURL, authorization } = getExternalApiContext(event)

    try {
        return await $fetch<T, 'json'>(path, {
            ...options,
            baseURL,
            responseType: 'json',
            headers: createHeaders(authorization, options.headers),
        })
    }
    catch (error: unknown) {
        const descriptor = describeExternalApiError(error)

        throw createError({
            statusCode: descriptor.statusCode,
            statusMessage: descriptor.statusMessage,
            message: descriptor.message,
            cause: error,
        })
    }
}

export async function requestExternalFile(
    event: H3Event,
    path: string,
    options: ExternalFileRequestOptions = {},
): Promise<ArrayBuffer> {
    const { baseURL, authorization } = getExternalApiContext(event)

    try {
        return await $fetch<ArrayBuffer, 'arrayBuffer'>(path, {
            ...options,
            baseURL,
            responseType: 'arrayBuffer',
            headers: createHeaders(authorization, options.headers),
        })
    }
    catch (error: unknown) {
        const descriptor = describeExternalApiError(error)

        throw createError({
            statusCode: descriptor.statusCode,
            statusMessage: descriptor.statusMessage,
            message: descriptor.message,
            cause: error,
        })
    }
}