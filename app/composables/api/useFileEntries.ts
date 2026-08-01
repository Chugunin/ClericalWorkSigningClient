import {ref} from 'vue'
import {FilesApi} from '~/api/files.api'
import type {FileEntry} from '#shared/types'

export const useFileEntries = () => {
    const isUploading = ref(false)
    const uploadError = ref<string | null>(null)

    const uploadFile = async (file: File): Promise<FileEntry | null> => {
        isUploading.value = true
        uploadError.value = null

        try {
            return await FilesApi.saveEntry(file)
        } catch (err: any) {
            uploadError.value = err.message || 'Ошибка при загрузке файла'
            return null
        } finally {
            isUploading.value = false
        }
    }

    return {
        uploadFile,
        isUploading,
        uploadError
    }
}