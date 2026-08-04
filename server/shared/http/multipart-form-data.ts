import type { H3Event, MultiPartData } from 'h3'
import {
    createError,
    readMultipartFormData,
} from 'h3'

function appendMultipartEntry(
    target: FormData,
    entry: MultiPartData,
): void {
    if (!entry.name) {
        return
    }

    if (entry.filename) {
        target.append(
            entry.name,
            new Blob(
                [new Uint8Array(entry.data)],
                { type: entry.type || 'application/octet-stream' },
            ),
            entry.filename,
        )
        return
    }

    target.append(entry.name, entry.data.toString('utf8'))
}

export async function readRequiredMultipartFormData(
    event: H3Event,
): Promise<FormData> {
    const entries = await readMultipartFormData(event)

    if (!entries?.length) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Multipart form data is required',
        })
    }

    const formData = new FormData()

    for (const entry of entries) {
        appendMultipartEntry(formData, entry)
    }

    return formData
}
