// server/utils/external-file-api.ts
import type {H3Event} from 'h3'

export async function externalFileApi(
    event: H3Event,
    path: string,
) {
    const config = useRuntimeConfig(event)

    try {
        const response = await fetch(`${config.signingApi}${path}`)
        
        console.log(response)

        if (!response.ok) {
            throw createError({
                statusCode: response.status,
                statusMessage: response.statusText,
            })
        }

        return response
    } catch (error: unknown) {
        throw createError({
            statusCode: 500,
            statusMessage: 'External file request failed',
        })
    }
}