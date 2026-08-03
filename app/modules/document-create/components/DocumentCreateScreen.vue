<script setup lang="ts">
import { computed, ref, shallowReactive } from 'vue'

import { useDictionariesStore } from '~/modules/dictionaries'
import { useAppToast } from '~/shared/composables'
import { formatDate } from '~/shared/lib/date'

import { DocumentCreateApi } from '../api/document-create.api'
import { validateDocumentCreateForm } from '../lib/document-create.validation'
import { mapDocumentCreateFormToRequest } from '../mappers/document-create.mapper'
import { createDocumentSubmitter } from '../model/document-create-submit'
import type { DocumentFormModel } from '../model/document-create-form.model'
import DocumentCreateForm from './DocumentCreateForm.vue'

const emit = defineEmits<{
  closeContainer: []
}>()

const dictionaries = useDictionariesStore()
if (!dictionaries.isLoaded) {
  await dictionaries.fetchDictionaries()
}

const model = shallowReactive<DocumentFormModel>({
  name: '',
  date: undefined,
  description: '',
  statusId: undefined,
  originId: undefined,
  executorId: undefined,
  signerIds: [],
  files: [],
})

const toast = useAppToast()
const isSubmitting = ref(false)
const loadError = computed(() => dictionaries.error)

const submitDocument = createDocumentSubmitter({
  createDocument: request => DocumentCreateApi.create(request),
  mapFormToRequest: mapDocumentCreateFormToRequest,
})

async function handleSubmit() {
  toast.clear()

  const messages = validateDocumentCreateForm(model)
  toast.showMany(messages, 5000, true)

  if (messages.some(message => message.level === 'error')) return

  try {
    isSubmitting.value = true
    const document = await submitDocument(model)

    toast.show({
      text: `Документ ${document.Name} от ${formatDate(document.CreatedDate)} создан`,
      level: 'success',
    }, 3000)

    emit('closeContainer')
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Не удалось создать документ'
    toast.show({ text, level: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  emit('closeContainer')
}
</script>

<template>
  <div class="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden">
    <div v-if="dictionaries.isLoading" class="min-h-0 flex-1">
      Загрузка справочников...
    </div>

    <div v-else-if="loadError" class="min-h-0 flex-1">
      Ошибка загрузки справочников
    </div>

    <DocumentCreateForm
      v-else
      v-model="model"
      class="min-h-0 flex-1"
      :persons="dictionaries.persons"
      :right-types="dictionaries.personRightTypes"
      :role-types="dictionaries.personRoleTypes"
      :decision-types="dictionaries.personDecisionTypes"
      :origin-types="dictionaries.documentOriginTypes"
      :status-types="dictionaries.documentStatusTypes"
      :file-types="dictionaries.documentFileTypes"
      :submitting="isSubmitting"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
