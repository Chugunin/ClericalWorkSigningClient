<script setup lang="ts">

import type {DocumentFilters} from "#shared/types/filters/document-filters";

interface OptionItem {
  label: string
  value: number
}

const model = defineModel<DocumentFilters>({required: true});

const props = withDefaults(defineProps<{
  statusOptions: OptionItem[]
  executorOptions: OptionItem[]
  departmentOptions: OptionItem[]
}>(), {
  statusOptions: () => [],
  executorOptions: () => [],
  departmentOptions: () => [],
});

const emit = defineEmits<{
  reset: []
}>();

function getSelectMenuToolTipText(origins: OptionItem[], values: number[]) {
  if (origins.length !== 0 && values.length !== 0)
    return origins
        .filter(o => values.includes(o.value))
        .map(o => `[${o.label}]`)
        .join(', ');

  return 'Не выбран';
}

const statusesTooltipText = computed(() => {
  return getSelectMenuToolTipText(props.statusOptions, model.value.statusIds);
});

const executorsTooltipText = computed(() => {
  return getSelectMenuToolTipText(props.executorOptions, model.value.executorIds);
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
        <UChip :show="model.searchText?.length !== 0" class="w-full min-w-0">
          <UTooltip :text="model.searchText ?? 'Пусто'" :content="{ side: 'bottom' }">
            <UiAppTextInput
                v-model="model.searchText"
                variant="outline"
                class="w-full min-w-0"
                icon="i-lucide-search"
                placeholder-text="Название, описание, ID"
            />
          </UTooltip>
        </UChip>
      </UFormField>

      <UFormField label="Статус" class="p-2 min-w-0">
        <UChip :show="model.statusIds?.length !== 0" class="w-full min-w-0">
          <UTooltip :text="statusesTooltipText" :content="{ side: 'bottom' }" arrow>
            <USelectMenu
                v-model="model.statusIds"
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
        <UChip :show="model.executorIds?.length !== 0" class="w-full min-w-0">
          <UTooltip :text="executorsTooltipText" :content="{ side: 'bottom' }" arrow>
            <USelectMenu
                v-model="model.executorIds"
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
        <UChip :show="model.dateSince != null" class="w-full min-w-0">
          <UiAppDatePicker v-model="model.dateSince" variant="outline" class="w-full min-w-0"
                           popover-content-class="z-[60] documents-control-filters-floating"/>
        </UChip>
      </UFormField>

      <UFormField label="Дата по" class="p-2 min-w-0">
        <UChip :show="model.dateTill != null" class="w-full min-w-0">
          <UiAppDatePicker v-model="model.dateTill" variant="outline" class="w-full min-w-0"
                           popover-content-class="z-[60] documents-control-filters-floating"/>
        </UChip>
      </UFormField>

    </div>

  </div>

</template>

<style scoped>

</style>
