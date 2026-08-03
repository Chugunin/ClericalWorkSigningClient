import { apiClient } from '~/shared/api'
import type { FileEntry } from '#shared/contracts/files/file-entry.contract'

export const filesApi = {
  async saveEntry(file: File): Promise<FileEntry> {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient<FileEntry>('/api/files/entries', {
      method: 'POST',
      body: formData,
    })
  },

  async fetchPhysicalFile(fileId: string, signal?: AbortSignal): Promise<Blob> {
    return $fetch<Blob>(`/api/files/physical/${fileId}`, {
      responseType: 'blob',
      signal,
    })
  },
}
