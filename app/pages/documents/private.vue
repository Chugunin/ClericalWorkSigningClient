<script setup lang="ts">

import type {DocumentFilters} from "#shared/types/contracts/requests/filters/document-filters";
import {formatDate} from "~/utils/date";
import type {DocumentCardModel} from "~/types/documents/private/card-model";
import {randomizeDefaultColor} from "~/utils/color";

useHead({
  title: 'Личная страница'
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

const filters = shallowRef<DocumentFilters>({
  executorIds: [1],
})

const {documents} = await useDocuments(filters, {scope: 'private-page'})

const documentCards = computed(() => {
  const models = ref<DocumentCardModel[]>([])

  documents.value
      .filter(d => d.Id)
      .forEach(d =>
          models.value.push({
            id: d.Id!,
            name: d.Name,
            date: formatDate(d.CreatedDate!),
            description: d.Description,
            statusText: statusTypes.value[d.StatusId!]?.Description ?? "",
            originText: originTypes.value[d.OriginId!]?.Description ?? "",
            executorText: persons.value[d.ExecutorId!]?.Name ?? "",
            headerColor: randomizeDefaultColor()
          })
      )

  return models.value
})

</script>

<template>
  <UCard
      class="min-h-0 w-7/10 flex-1"
      :ui="{
        root: 'flex flex-col h-full min-h-0 overflow-hidden',
        body: 'flex-1 min-h-0 overflow-auto'
      }"
  >
    <template #header>
      <div class="flex items-center justify-start gap-2 text-lg font-semibold">
        Мои документы
      </div>
    </template>

    <DocumentsPrivateCardBoard
        :document-cards="documentCards"
    />

  </UCard>
</template>

<style scoped>

</style>