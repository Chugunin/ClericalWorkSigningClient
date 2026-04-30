import type {ApiResponse} from "#shared/types/api/api-response";
import type {FileEntry} from "#shared/types/contracts/responses/file-entries/file-entry";

export async function saveFileEntry(file: File) {
    
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await $fetch<ApiResponse<FileEntry>>('/api/file-entries', {
        method: 'POST',
        body: formData,
    })

    if (!response.success) {
        throw new Error(response.error ?? 'File saving failed')
    }

    return response.data
}