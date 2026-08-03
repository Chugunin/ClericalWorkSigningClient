import { ref } from 'vue'
import { filesApi } from '../api/files.api'
import { useApiError, useLoading } from '~/shared/composables'
import type { FileEntry } from '#shared/contracts/files/file-entry.contract'

export async function saveFileEntry(file: File): Promise<FileEntry> {
  return filesApi.saveEntry(file)
}

export function useFileEntries() {
  const loader = useLoading()
  const apiError = useApiError()
  const uploadError = ref<string | null>(null)

  const uploadFile = async (file: File): Promise<FileEntry | null> => {
    uploadError.value = null

    return loader.execute(async () => {
      try {
        return await saveFileEntry(file)
      }
      catch (error) {
        uploadError.value = apiError.getMessage(error)
        return null
      }
    })
  }

  return {
    uploadFile,
    isUploading: loader.loading,
    uploadError,
  }
}
