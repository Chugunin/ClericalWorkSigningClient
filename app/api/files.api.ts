import { apiClient } from './api-client'
import type { FileEntry } from '#shared/types'

export interface PhysicalFileResponse {
    url: string
    mimeType: string
}

export const FilesApi = {

    async saveEntry(
        file: File
    ): Promise<FileEntry> {

        const formData = new FormData()

        formData.append('file', file)

        return await apiClient<FileEntry>(
            '/api/file-entries',
            {
                method: 'POST',
                body: formData
            }
        )
    },

    async getPhysicalFile(
        fileId: string
    ): Promise<PhysicalFileResponse> {

        const blob = await $fetch<Blob>(
            `/api/physical-file/${fileId}`,
            {
                responseType: 'blob'
            }
        )

        return {
            url: URL.createObjectURL(blob),
            mimeType: blob.type
        }
    }

}