import { ref } from 'vue'
import { DocumentsApi } from '~/api/documents.api'
import type { CreateDocumentRequestData, Document } from '#shared/types'

export const useFormDocuments = () => {
    const isSubmitting = ref(false)
    const error = ref<string | null>(null)

    // Предположим, у вас есть глобальный toast для уведомлений (Nuxt UI)
    const toast = useToast()

    const submitDocument = async (payload: CreateDocumentRequestData): Promise<Document | null> => {
        isSubmitting.value = true
        error.value = null

        try {
            const createdDocument = await DocumentsApi.create(payload)

            toast.add({
                title: 'Успех',
                description: `Документ "${createdDocument.Name}" успешно создан!`,
                color: 'primary'
            })

            return createdDocument
        } catch (err: any) {
            error.value = err.message || 'Произошла ошибка при создании документа'

            toast.add({
                title: 'Ошибка',
                description: error.value!,
                color: 'error'
            })

            return null
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        submitDocument,
        isSubmitting,
        error
    }
}