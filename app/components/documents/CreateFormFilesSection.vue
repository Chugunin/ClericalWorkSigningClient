<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {SigningDocumentFileType} from "#shared/types/dictionaries/signing-document-file-type";

const model = defineModel<DocumentFormModel>({ required: true })

const props = defineProps<{
  fileTypes: SigningDocumentFileType[]
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