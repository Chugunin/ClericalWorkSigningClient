<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {DocumentFileType} from "#shared/types/contracts/responses/dictionaries/document-file-type";

const model = defineModel<DocumentFormModel>({required: true})

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

      <div class="h-full min-h-0 pb-0.25 overflow-auto">
        <UFileUpload
            layout="grid"
            multiple
            :interactive="false"
            label="Перетащите сюда файлы"
        >

          <template #files-top="{ open, files }">
            <div v-if="files?.length" class="mb-2 flex items-center justify-between">
              <p class="font-bold">Всего: ({{ files?.length }})</p>

              <UButton
                  icon="i-lucide-plus"
                  label="Добавить"
                  color="neutral"
                  variant="outline"
                  class="-my-2"
                  @click="open()"
              />
            </div>
          </template>

        </UFileUpload>
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>
