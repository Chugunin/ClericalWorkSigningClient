<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {DocumentFileType} from "#shared/types/dictionaries/document-file-type";

const model = defineModel<DocumentFormModel>({ required: true })

const props = defineProps<{
  fileTypes: DocumentFileType[]
}>()

</script>

<template>
  <div class="space-y-4">
    <UCard>
      <template #header>
        Файлы
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>