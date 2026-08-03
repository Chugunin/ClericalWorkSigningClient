import { ref } from 'vue'

import { FilesApi } from '~/api/files.api'

import { useApiError } from '~/composables/api/useApiError'
import { useLoading } from '~/composables/api/useLoading'

import type { FileEntry } from '#shared/types'

export const useFileEntries = () => {

    const loader = useLoading()
    const apiError = useApiError()

    const uploadError = ref<string | null>(null)

    const uploadFile = async (
        file: File,
    ): Promise<FileEntry | null> => {

        uploadError.value = null

        return loader.execute(async () => {

            try {

                return await FilesApi.saveEntry(file)

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