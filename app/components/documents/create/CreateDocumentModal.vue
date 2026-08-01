<script setup lang="ts">
import { ref } from 'vue'
import { useDictionariesStore } from '~/stores/dictionaries.store'
import { useFormDocuments } from '~/composables/documents/create/useFormDocuments'
import AppModal from "~/components/ui/AppModal.vue";

const isOpen = defineModel<boolean>()

// Подключаем стор из Шага 3
const dictionaries = useDictionariesStore()

// Подключаем логику отправки из Шага 4
const { submitDocument, isSubmitting } = useFormDocuments()

const formData = ref({
  name: '',
  statusId: undefined
})

const onSubmit = async () => {
  const newDoc = await submitDocument(formData.value)
  if (newDoc) {
    isOpen.value = false // Закрываем при успехе
  }
}
</script>

<template>
  <AppModal v-model="isOpen" title="Создание нового документа">

    <form @submit.prevent="onSubmit">
      <UiAppTextInput v-model="formData.name" label="Название документа" required />

      <USelectMenu
          v-model="formData.statusId"
          :options="dictionaries.documentStatusTypes"
          value-attribute="Id"
          option-attribute="Name"
          label="Статус"
      />

      <div class="mt-4 flex justify-end">
        <UButton type="submit" :loading="isSubmitting" color="primary">
          Создать
        </UButton>
      </div>
    </form>

  </AppModal>
</template>