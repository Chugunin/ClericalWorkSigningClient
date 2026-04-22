<script setup lang="ts">
import type {DocumentFormModel} from '~/types/documents/create/form-model'
import {formatDate} from "~/utils/date";

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

  const messages = validateFormDocument(model)

  toast.showMany(messages, 5000, true)

  if (messages.some(message => message.level === 'error'))
    return;

  try {
    isSubmitting.value = true

    const document = await saveFormDocument(model)
    
    toast.show(
        {
          text: `Документ ${document.Name} от ${formatDate(document.CreatedDate)} создан`,
          level: "success"
        }
        , 3000
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
