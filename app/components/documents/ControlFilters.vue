<script setup lang="ts">

import type {DocumentFilters} from "#shared/types/filters/document-filters";

interface OptionItem {
  label: string
  value: number
}

const model = defineModel<DocumentFilters>({required: true})

const props = defineProps<{
  statusOptions: OptionItem[]
  executorOptions: OptionItem[]
  departmentOptions: OptionItem[]
}>()

const emit = defineEmits<{
  reset: []
}>()

const filtersExpanded = ref(false);

</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-medium">Фильтры</h2>
          <p class="text-sm text-muted">
            Уточни список документов по основным параметрам.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-rotate-ccw"
              @click="emit('reset')"
          >
            Сбросить
          </UButton>

          <UButton
              color="neutral"
              variant="ghost"
              :icon="filtersExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              square
              @click="filtersExpanded = !filtersExpanded"
          />
        </div>
      </div>
    </template>

    <div v-if="filtersExpanded" class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-7">

      <UFormField label="Поиск" class="p-2 min-w-0">
        <UInput
            v-model="model.search"
            placeholder="Название, описание или ID"
            icon="i-lucide-search"
            class="w-full min-w-0"
        />
      </UFormField>

      <UFormField label="Статус" class="p-2 min-w-0">
        <USelectMenu
            v-model="model.statusIds"
            :items="props.statusOptions"
            multiple
            value-key="value"
            option-attribute="label"
            placeholder="Все статусы"
            class="w-full min-w-0"
        />
      </UFormField>

      <UFormField label="Исполнитель" class="p-2 min-w-0">
        <USelectMenu
            v-model="model.executorIds"
            :items="props.executorOptions"
            multiple
            value-key="value"
            option-attribute="label"
            placeholder="Все исполнители"
            class="w-full min-w-0"
        />
      </UFormField>

      <UFormField label="Дата с" class="p-2 min-w-0">
        <UPopover>
          <UButton color="neutral" variant="outline" class="w-full justify-between min-w-0">
            <span>
              {{
                formatCalendarDate(model.dateSince) || 'Выбрать дату'
              }}
            </span>
            <UIcon name="i-lucide-calendar"/>
          </UButton>

          <template #content>
            <UCalendar v-model="model.dateSince" class="p-2" locale="ru-RU"/>
          </template>
        </UPopover>
      </UFormField>

      <UFormField label="Дата по" class="p-2 min-w-0">
        <UPopover>
          <UButton color="neutral" variant="outline" class="w-full justify-between min-w-0">
            <span>
              {{
                formatCalendarDate(model.dateTill) || 'Выбрать дату'
              }}
            </span>
            <UIcon name="i-lucide-calendar"/>
          </UButton>

          <template #content>
            <UCalendar v-model="model.dateTill" class="p-2" locale="ru-RU"/>
          </template>
        </UPopover>
      </UFormField>

    </div>

  </UCard>

</template>

<style scoped>

</style>
