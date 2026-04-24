<script setup lang="ts">

import type {DocumentCardItem} from "~/types/documents/private/card-item-model";

const props = withDefaults(defineProps<{
  documentCards: DocumentCardItem[] | []
  loading?: boolean
}>(), {
  loading: false
})

</script>

<template>
  <div class="h-full min-h-0 overflow-y-auto">
    <div class="columns-1 sm:columns-2 xl:columns-3 2xl:columns-4 p-2 gap-4">
      <UCard
          v-for="documentCard in documentCards"
          :key="documentCard.id"
          class="mb-4 break-inside-avoid-column"
          :class="['border', documentCard.statusColor.borderClass]"
      >
        <template #header>
          <div class="flex flex-col gap-0.5 justify-stretch">

            <div class="font-medium truncate">
              {{ documentCard.name }}
            </div>
            
            <div class="font-medium text-muted">
              от {{ documentCard.dateText }}
            </div>

            <UBadge variant="solid" class="justify-center" :class="[documentCard.statusColor.bgClass, documentCard.statusColor.textClass]">
              <span class="font-bold text-sm">{{ documentCard.statusText }}</span>
            </UBadge>

          </div>
        </template>

        <div class="flex flex-col justify-start gap-2 whitespace-pre-line wrap-break-word">
          
          <div class="flex flex-col">
            <span>Описание:</span>
            <span class="text-sm text-muted">
              {{ documentCard.description ?? '[пусто]'}}
            </span>
          </div>
          
        </div>

      </UCard>
    </div>
  </div>
</template>

<style scoped>

</style>