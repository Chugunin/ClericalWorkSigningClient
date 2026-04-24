<script setup lang="ts">

import type {DocumentFilters} from "#shared/types/contracts/requests/filters/document-filters";
import {formatDate} from "~/utils/date";
import type {DocumentCardItem} from "~/types/documents/private/card-item-model";
import {getDocumentStatusColor} from "~/utils/color";
import type {DocumentChartItem} from "~/types/documents/private/chart-item-model";

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

const periods = [
  {label: 'День', value: 'day'},
  {label: 'Неделя', value: 'week'},
  {label: 'Месяц', value: 'month'},
  {label: 'Всё время', value: 'allTime'}
] as const

const periodIndex = ref(2)
const selectedPeriod = computed(() => periods[periodIndex.value])

const dateBySelectedPeriod = computed(() => {
  switch (selectedPeriod?.value?.value) {
    case 'day':
      return formatDateToISO(getTodayDateValue().add({days: -1}))
    case 'week':
      return formatDateToISO(getTodayDateValue().add({weeks: -1}))
    case 'month':
      return formatDateToISO(getTodayDateValue().add({months: -1}))
    default:
      return undefined
  }
})

const hiddenStatusIds = ref<number[]>([])
const hiddenStatusIdSet = computed(() => new Set(hiddenStatusIds.value))

const filters = computed<DocumentFilters>(() => ({
  ExecutorIds: [2],
  DateSince: dateBySelectedPeriod.value,
}))

const {documents} = await useDocuments(filters, {scope: 'private-page'})

const statusTypeById = computed(() =>
    Object.fromEntries(
        statusTypes.value.map(status => [status.Id, status])
    )
)

const model = computed(() => {
  const cards: DocumentCardItem[] = []
  const chartItems: DocumentChartItem[] = []

  Object.entries(
      Object.groupBy(
          documents.value.filter(d => d.Id && d.StatusId),
          d => d.StatusId!
      )
  ).forEach(([statusId, items]) => {
    const id = Number(statusId)
    const statusText = statusTypeById.value[id]?.Description ?? ''
    const statusColor = getDocumentStatusColor(id)

    if (!hiddenStatusIdSet.value.has(id)) {
      items?.forEach(d => {
        cards.push({
          id: d.Id!,
          name: d.Name,
          dateText: formatDate(d.CreatedDate!),
          description: d.Description,
          statusText,
          statusColor,
          originText: originTypes.value[d.OriginId!]?.Description ?? '',
          executorText: persons.value[d.ExecutorId!]?.Name ?? '',
        })
      })
    }

    chartItems.push({
      statusId: id,
      label: statusText,
      count: items?.length ?? 0,
      color: statusColor,
    })
  })

  return {cards, chartItems}
})

const documentCards = computed(() => model.value.cards)
const documentChartItems = computed(() => model.value.chartItems)

const isPeriodTooltipOpen = ref(false)
let periodTooltipTimer: ReturnType<typeof setTimeout> | null = null

function showTooltipTemporarily() {
  isPeriodTooltipOpen.value = true

  if (periodTooltipTimer) {
    clearTimeout(periodTooltipTimer)
  }

  periodTooltipTimer = setTimeout(() => {
    isPeriodTooltipOpen.value = false
    periodTooltipTimer = null
  }, 1000)
}

function onChartLegendClick(payload: { statusId: number }) {
  const id = payload.statusId

  hiddenStatusIds.value = hiddenStatusIds.value.includes(id)
      ? hiddenStatusIds.value.filter(x => x !== id)
      : [...hiddenStatusIds.value, id]
}

function resetHiddenStatuses() {
  hiddenStatusIds.value = []
}

watch(periodIndex, () => {
  showTooltipTemporarily()
})

onBeforeUnmount(() => {
  if (periodTooltipTimer) {
    clearTimeout(periodTooltipTimer)
  }
})

</script>

<template>
  <div class="flex flex-row justify-between w-full h-full p-2 gap-2 overflow-hidden">

    <UCard
        class="min-h-0 w-7/10"
        :ui="{
          root: 'flex flex-col h-full min-h-0 overflow-hidden',
          body: 'flex-1 min-h-0 overflow-auto'
        }"
    >
      <template #header>
        <div class="flex w-full items-center gap-2">
          <div class="flex text-lg font-semibold">
            Мои документы
          </div>
          <div class="flex flex-1 items-center justify-end gap-2">
            <UButton
                icon="i-lucide-arrow-down-up"
                color="neutral"
                variant="ghost"

            />
            <span>Показать за период:</span>
            <USlider v-model="periodIndex"
                     :min="0"
                     :max="periods.length - 1"
                     :step="1"
                     :tooltip="{
                       open: isPeriodTooltipOpen,
                       text: selectedPeriod?.label,
                       content: {
                         side: 'top'
                       }
                     }"
                     @mouseenter="isPeriodTooltipOpen = true"
                     @mouseleave="isPeriodTooltipOpen = false"
                     class="w-1/3"
            />
          </div>
        </div>
      </template>

      <DocumentsPrivateCardBoardSection
          :document-cards="documentCards"
      />

    </UCard>

    <UCard
        class="min-h-0 w-3/10"
        :ui="{
          root: 'flex flex-col h-full min-h-0 overflow-hidden',
          body: 'flex-1 min-h-0 items-center justify-center overflow-auto',
          header: 'h-0 hidden'
        }"
    >

      <ClientOnly>
        <LazyDocumentsPrivateChartsSection
            :items="documentChartItems"
            :hidden-status-ids="hiddenStatusIds"
            @legend-click="onChartLegendClick"
        />

        <template #fallback>
          <USkeleton class="w-full h-full rounded-xl"/>
        </template>
      </ClientOnly>

      <template #footer>
        <div class="flex items-center justify-center gap-2">
          <UButton
              icon="i-lucide-rotate-ccw"
              color="neutral"
              variant="ghost"
              :disabled="hiddenStatusIds.length === 0"
              @click="resetHiddenStatuses"
          >
            Сбросить
          </UButton>
        </div>
      </template>


    </UCard>

  </div>

</template>

<style scoped>

</style>