<script setup lang="ts">

import type {DocumentCardModel} from "~/types/documents/private/card-model";

const props = withDefaults(defineProps<{
  documentCards: DocumentCardModel[] | []
  loading?: boolean
}>(), {
  loading: false
})

/*const items = [
  {id: 1, title: 'Карточка 1', text: 'Короткий текст'},
  {
    id: 2,
    title: 'Карточка 2',
    text: 'Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст...'
  },
  {id: 3, title: 'Карточка 3', text: 'Средний текст'},
  {id: 4, title: 'Карточка 4', text: 'Еще больше текста\nЕще строка\nЕще строка'},
  {
    id: 6,
    title: 'Карточка 2',
    text: 'Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст...'
  },
  {id: 7, title: 'Карточка 3', text: 'Средний текст'},
  {id: 9, title: 'Карточка 1', text: 'Короткий текст'},
  {
    id: 10,
    title: 'Карточка 2',
    text: 'Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст... Очень длинный текст...'
  },
  {id: 11, title: 'Карточка 3', text: 'Средний текст'},
  {id: 12, title: 'Карточка 4', text: 'Еще больше текста\nЕще строка\nЕще строка'},
]*/

</script>

<template>
  <div class="h-full min-h-0 overflow-y-auto">
    <div class="columns-1 sm:columns-2 xl:columns-3 p-2 gap-4">
      <UCard
          v-for="documentCard in documentCards"
          :key="documentCard.id"
          class="mb-4 break-inside-avoid-column"
          :ui="{ header: `bg-${documentCard.headerColor}` }"
      >
        <template #header>
          <div class="flex flex-col justify-stretch">

            <div class="font-medium text-inverted">
              {{ documentCard.name }}
            </div>

            <UBadge variant="soft" class="text-inverted">
              <!--class="p-1 text-inverted bg-transparent border border-base/50"-->
              <span class="font-bold underline">Статус:</span>
              <span>{{ documentCard.statusText }}</span>
            </UBadge>

          </div>
        </template>

        <div class="flex flex-col justify-start gap-2">
          <div v-if="documentCard.description">
            <span>Описание:</span>
            <br>
            <span class="text-sm text-muted">{{ documentCard.description }}</span>
          </div>
          <p class="whitespace-pre-line wrap-break-word">
            {{ "placeholder" }}
          </p>
        </div>

      </UCard>
    </div>
  </div>
</template>

<style scoped>

</style>