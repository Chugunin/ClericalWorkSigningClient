<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {DocumentFileType} from "#shared/types/contracts/responses/dictionaries/document-file-type";

const model = defineModel<DocumentFormModel>({ required: true })

const props = defineProps<{
  fileTypes: DocumentFileType[]
}>()

</script>

<template>
  <div class="flex min-h-0 w-full flex-1 flex-col">
    <UCard
        class="min-h-0 w-full flex-1"
        :ui="{
          root: 'flex h-full min-h-0 flex-col overflow-hidden',
          body: 'min-h-0 flex-1 overflow-hidden'
        }"
    >
      <template #header>
        Файлы
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>
