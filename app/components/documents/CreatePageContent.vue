<script setup lang="ts">

import {today, getLocalTimeZone, CalendarDate} from '@internationalized/date'
import type {DocumentFormModel} from "~/types/documents/document-form-model";

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
  search: null,
  date: null,
  description: null,
  statusId: null,
  originId: null,
  executorId: null,
  signerIds: [],
})

async function handleSubmit() {
  console.log('submit', form)
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