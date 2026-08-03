import { ref } from 'vue'
import { DocumentsApi } from '~/api/documents.api'
import { useApiError } from '~/composables/api/useApiError'
import { useLoading } from '~/composables/api/useLoading'
import { useAppToast } from '~/composables/ui/useAppToast'

import type {
    CreateDocumentRequestData,
    Document,
} from '#shared/types'

export const useFormDocuments = () => {

    const loader = useLoading()
    const apiError = useApiError()
    const toast = useAppToast()

    const error = ref<string | null>(null)

    const submitDocument = async (
        payload: CreateDocumentRequestData,
    ): Promise<Document | null> => {

        error.value = null

        return loader.execute(async () => {

            try {

                const created = await DocumentsApi.create(payload)

                toast.success(
                    `Документ "${created.Name}" успешно создан.`,
                )

                return created

            }
            catch (e) {

                error.value = apiError.getMessage(e)

                toast.error(error.value)

                return null

            }

        })

    }

    return {

        submitDocument,

        isSubmitting: loader.loading,

        error,

    }

}