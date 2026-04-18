<script setup lang="ts">
import type {Document} from '#shared/types/contracts/responses/documents/document'
import type {DocumentFormModel} from '~/types/documents/document-form-model'
import {validateCreateForm} from "~/components/documents/create/validateCreateForm";
import {formatDate, formatDateToISO} from "~/utils/date";
import type {CreateDocumentRequestData} from "#shared/types/contracts/requests/documents/create-document-request-data";
import {createNewDocument} from "~/components/documents/create/createNewDocument";

definePageMeta({
  layout: 'documents-create-layout'
})

useHead({
  title: 'Новый документ'
})

const {
  persons,
  rightTypes,
  roleTypes,
  decisionTypes,
  fileTypes,
  originTypes,
  statusTypes,
  status,
  error,
} = await useDictionaries()

const model = shallowReactive<DocumentFormModel>({
  name: '',
  date: undefined,
  description: '',
  statusId: undefined,
  originId: undefined,
  executorId: undefined,
  signerIds: [],
})

const toast = useAppToast()
const isSubmitting = ref(false)

async function handleSubmit() {
  toast.clear()

  const messages = validateCreateForm(model)

  toast.showMany(messages)

  if (messages.some(message => message.level === 'error'))
    return;

  try {
    isSubmitting.value = true

    const documentResponse = await createNewDocument(model)

    const duration = 3000

    toast.show(
        {
          text: `Документ ${documentResponse.Name} от ${formatDate(documentResponse.CreatedDate)} создан`,
          level: "success"
        }
        , duration
    )

    emit('closeContainer')

  } catch (error) {
    const text = error instanceof Error ? error.message : "Не удалось создать документ"
    toast.show({text: text, level: 'error'})
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  console.log('cancel', model)
}

const emit = defineEmits<{
  closeContainer: []
}>()


</script>

<template>
  <div class="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden">
    <div v-if="status === 'pending'" class="min-h-0 flex-1">
      Загрузка словарей...
    </div>

    <div v-else-if="error" class="min-h-0 flex-1">
      Ошибка загрузки словарей
    </div>

    <DocumentsCreateForm
        v-else
        v-model="model"
        class="min-h-0 flex-1"
        :persons="persons"
        :right-types="rightTypes"
        :role-types="roleTypes"
        :decision-types="decisionTypes"
        :origin-types="originTypes"
        :status-types="statusTypes"
        :file-types="fileTypes"
        @submit="handleSubmit"
        @cancel="handleCancel"
    />
  </div>
</template>
