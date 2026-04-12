<script setup lang="ts">

import {today, getLocalTimeZone, CalendarDate} from '@internationalized/date'
import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {Document} from "#shared/types/data/document";

definePageMeta({
  layout: 'documents-create-layout'
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

const form = reactive<DocumentFormModel>({
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

  if (!form.name?.trim()) {
    submitError.value = 'Укажите название документа'
    return
  }

  isSubmitting.value = true

  try {
    const executorRecord = form.executorId
        ? [{
          PersonId: form.executorId,
          RoleId: 1,
          DecisionId: decisionTypes.value[0]?.Id ?? 1,
        }]
        : []

    const document: Document = {
      Name: form.name.trim(),
      Description: form.description?.trim() || undefined,
      StatusId: form.statusId,
      OriginId: form.originId,
      ExecutorId: form.executorId,
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

async function handleCancel() {
  console.log('cancel', form)
}

const documentDate = shallowRef<CalendarDate>(new CalendarDate(
    today(getLocalTimeZone()).year,
    today(getLocalTimeZone()).month,
    today(getLocalTimeZone()).day)
);

</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">Новый документ</h1>
      <p class="text-sm text-muted">
        Заполните основные поля и выберите участников согласования.
      </p>
    </div>

    <div v-if="status === 'pending'">
      Загрузка словарей...
    </div>

    <div v-else-if="error">
      Ошибка загрузки словарей
    </div>

    <UAlert
        v-if="submitError"
        color="error"
        variant="soft"
        :description="submitError"
    />

    <DocumentsCreateForm
        v-else
        v-model="form"
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

<style scoped>

</style>
