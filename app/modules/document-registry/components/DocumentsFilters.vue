<script setup lang="ts">
import { AppDatePicker, AppTextInput } from '~/shared/ui'

import type { DocumentFilters } from '#shared/contracts/documents/document-filters.contract'
import type {DateValue} from "@internationalized/date"
import {formatDateToISO} from "~/shared/lib/date"

interface OptionItem {
  label: string
  value: number
}

const model = defineModel<DocumentFilters>({required: true});

const dateSince = ref<DateValue | undefined>()
const dateTill = ref<DateValue | undefined>()

watch(dateSince, () => {
  model.value.DateSince = formatDateToISO(dateSince.value)
})

watch(dateTill, () => {
  model.value.DateTill = formatDateToISO(dateTill.value)
})

const props = withDefaults(defineProps<{
  statusOptions?: OptionItem[]
  executorOptions?: OptionItem[]
  departmentOptions?: OptionItem[]
}>(), {
  statusOptions: () => [],
  executorOptions: () => [],
  departmentOptions: () => [],
});

const emit = defineEmits<{
  reset: []
}>();

function getSelectMenuToolTipText(origins: OptionItem[], values: number[] | undefined) {
  if (origins?.length !== 0 && values?.length !== 0)
    return origins
        .filter(o => values!.includes(o.value))
        .map(o => `[${o.label}]`)
        .join(', ');

  return 'Не выбран';
}

const statusesTooltipText = computed(() => {
  return getSelectMenuToolTipText(props.statusOptions, model.value.StatusIds);
});

const executorsTooltipText = computed(() => {
  return getSelectMenuToolTipText(props.executorOptions, model.value.ExecutorIds);
});

</script>

<template>
  <div class="space-y-4">

    <div class="flex items-center justify-between gap-3">
      <div class="text-sm font-medium">Фильтры</div>

      <UButton
          size="sm"
          color="error"
          variant="outline"
          icon="i-lucide-rotate-ccw"
          @click="emit('reset')"
      >
        Сбросить
      </UButton>
    </div>

    <div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">

      <UFormField label="Поиск" class="p-2 min-w-0">
        <UChip :show="model.SearchText?.length !== 0" class="w-full min-w-0">
          <UTooltip :text="model.SearchText ?? 'Пусто'" :content="{ side: 'bottom' }">
            <AppTextInput
                v-model="model.SearchText"
                variant="outline"
                class="w-full min-w-0"
                icon="i-lucide-search"
                placeholder-text="Название, описание, ID"
            />
          </UTooltip>
        </UChip>
      </UFormField>

      <UFormField label="Статус" class="p-2 min-w-0">
        <UChip :show="model.StatusIds?.length !== 0" class="w-full min-w-0">
          <UTooltip :text="statusesTooltipText" :content="{ side: 'bottom' }" arrow>
            <USelectMenu
                v-model="model.StatusIds"
                :items="props.statusOptions"
                multiple
                clear
                value-key="value"
                option-attribute="label"
                placeholder="Все статусы"
                class="w-full min-w-0"
                :content="{
                  side: 'bottom',
                  align: 'start',
                  sideOffset: 8
                }"
                :ui="{
                  content: 'z-[60] documents-control-filters-floating'
                }"
            />
          </UTooltip>
        </UChip>
      </UFormField>

      <UFormField label="Исполнитель" class="p-2 min-w-0">
        <UChip :show="model.ExecutorIds?.length !== 0" class="w-full min-w-0">
          <UTooltip :text="executorsTooltipText" :content="{ side: 'bottom' }" arrow>
            <USelectMenu
                v-model="model.ExecutorIds"
                :items="props.executorOptions"
                multiple
                clear
                value-key="value"
                option-attribute="label"
                placeholder="Все"
                class="w-full min-w-0"
                :content="{
                  side: 'bottom',
                  align: 'start',
                  sideOffset: 8
                }"
                :ui="{
                  content: 'z-[60] documents-control-filters-floating'
                }"
            />
          </UTooltip>
        </UChip>
      </UFormField>

      <UFormField label="Дата с" class="p-2 min-w-0">
        <UChip :show="!!dateSince" class="w-full min-w-0">
          <AppDatePicker
v-model="dateSince" variant="outline" class="w-full min-w-0"
                           popover-content-class="z-[60] documents-control-filters-floating"/>
        </UChip>
      </UFormField>

      <UFormField label="Дата по" class="p-2 min-w-0">
        <UChip :show="!!dateTill" class="w-full min-w-0">
          <AppDatePicker
v-model="dateTill" variant="outline" class="w-full min-w-0"
                           popover-content-class="z-[60] documents-control-filters-floating"/>
        </UChip>
      </UFormField>

    </div>

  </div>

</template>

<style scoped>

</style>
