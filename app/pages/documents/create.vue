<script setup lang="ts">
import type {Document} from '#shared/types/data/document'
import type {DocumentFormModel} from '~/types/documents/document-form-model'

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

const toast = useToast()
const isSubmitting = ref(false)

async function handleSubmit() {
  toast.clear()

  const submitMessages = ref<{
    text: string,
    level: 'error' | 'warning' | 'info'
  }[]>([])

  if (!model.name?.trim()) {
    submitMessages.value.push({text: 'Укажите название документа', level: 'error'})
  }

  if (!model.date) {
    submitMessages.value.push({text: 'Укажите дату документа', level: 'error'})
  }

  if (!model.executorId) {
    submitMessages.value.push({text: 'Укажите исполнителя документа', level: 'error'})
  }

  if (!model.originId) {
    submitMessages.value.push({text: 'Укажите тип документа', level: 'error'})
  }

  if (!model.signerIds || model.signerIds.length == 0) {
    submitMessages.value.push({text: 'Укажите с кем документ согласовывается', level: 'error'})
  }

  else {
    submitMessages.value.push({text: model.signerIds.map(s => `[${s.signerId} - ${s.roleId}]`).join(", "), level: "info"})
  }

  if (!model.description) {
    submitMessages.value.push({text: 'Укажите описание документа', level: 'warning'})
  }

  submitMessages.value.forEach((message) => {
    showSubmitMessageToast(message.text, message.level)
  })

  if (submitMessages.value.filter(message => message.level === 'error').length > 0)
    return

  /*isSubmitting.value = true

  try {
    const executorRecord = model.executorId
        ? [{
          PersonId: model.executorId,
          RoleId: roleTypes.value[0]?.Id ?? 1,
          DecisionId: decisionTypes.value[0]?.Id ?? 1,
        }]
        : []

    const document: Document = {
      Name: model.name.trim(),
      Description: model.description?.trim() || undefined,
      StatusId: model.statusId,
      OriginId: model.originId,
      ExecutorId: model.executorId,
      Comments: [],
      Files: [],
      Records: executorRecord,
    }

    await createDocument(document)
  } catch (error) {
    showSubmitError(error instanceof Error ? error.message : 'Не удалось создать документ')
  } finally {
    isSubmitting.value = false
  }*/
}

function handleCancel() {
  console.log('cancel', model)
}

function showSubmitMessageToast(messageText: string, messageLevel: 'error' | 'warning' | 'info') {
  const title = {
    'error': 'Не удалось создать документ',
    'warning': 'Указаны некорректные данные',
    'info': 'Информация',
  }

  toast.add({
    id: Math.random().toString(36).slice(2, 16),
    title: title[messageLevel],
    description: messageText,
    color: messageLevel,
    icon: 'i-lucide-circle-alert',
    duration: 3000,
    close: true,
    progress: true,
  })
}

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
