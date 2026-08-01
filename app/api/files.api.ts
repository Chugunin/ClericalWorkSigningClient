import { apiClient } from './api-client'
import type { FileEntry } from '#shared/types'

export const FilesApi = {
    async saveEntry(file: File): Promise<FileEntry> {
        const formData = new FormData()
        formData.append('file', file)

        return await apiClient<FileEntry>('/api/file-entries', {
            method: 'POST',
            body: formData
        })
    },

    async getPhysicalFile(fileId: string): Promise<{ url: string; mimeType: string }> {
        const blob = await $fetch<Blob>(`/api/physical-file/${fileId}`, {
            responseType: 'blob'
        })

        const url = URL.createObjectURL(blob)

        return {
            url,
            mimeType: blob.type
        }
    }
}