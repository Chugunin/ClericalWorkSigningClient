import { externalApi } from '../utils/external-api'
import type { ApiResponse } from '#shared/types/api/api-response'
import type {FileEntry} from "#shared/types/contracts/responses/file-entries/file-entry";

export default defineEventHandler(async (event): Promise<ApiResponse<FileEntry>> => {
    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Multipart form data is required',
        })
    }
    
    const file = formData.find(p => p.name === 'file')
    
    if (!file) {
        throw createError({
            statusCode: 400,
            statusMessage: 'File payload is required',
        })
    }

    const forwardedFormData = new FormData()
    forwardedFormData.append(
        'file',
        new Blob([new Uint8Array(file.data)], { type: file.type || 'application/octet-stream' }),
        file.filename || 'file'
    )

    const fileEntry = await externalApi<FileEntry>(
        event,
        '/api/files/SaveFileEntry',
        {
            method: 'POST',
            body: forwardedFormData,
        },
    )

    return {
        success: true,
        data: fileEntry,
    }
})
