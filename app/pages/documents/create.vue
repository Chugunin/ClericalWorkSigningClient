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

const submitError = ref<string | null>(null)
const isSubmitting = ref(false)

async function handleSubmit() {
  submitError.value = null

  if (!model.name?.trim()) {
    submitError.value = 'Укажите название документа'
    return
  }

  isSubmitting.value = true

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
    submitError.value = error instanceof Error ? error.message : 'Не удалось создать документ'
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  console.log('cancel', model)
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

    <UAlert
        v-if="submitError"
        class="shrink-0"
        color="error"
        variant="soft"
        :description="submitError"
    />

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
