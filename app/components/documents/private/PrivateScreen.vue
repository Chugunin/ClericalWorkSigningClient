<script setup lang="ts">

import type {DocumentFilters} from "#shared/types/contracts/requests/filters/document-filters";
import {formatDate, MaximalDate, MinimalDate, Periods} from "~/utils/date";
import type {DocumentCardItem} from "~/types/documents/private/card-item-model";
import {getDocumentStatusColor} from "~/utils/color";
import type {DocumentChartItem} from "~/types/documents/private/chart-item-model";
import type {DateValue} from "@internationalized/date";
import type {BreadcrumbItem} from "#ui/components/Breadcrumb.vue";
import {onClickOutside} from "@vueuse/core";
import {GetSortOrderByDirection} from "~/utils/sort";

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

type ExecutorItem = {
  label: string;
  value: number;
}

const executorItems = computed(() =>
    persons.value.map(item => (
        {
          label: `${item.Name}`,
          value: item.Id,
        })) as ExecutorItem[],
)

const selectedExecutorId = ref<number>()

const statusTypeById = computed(() =>
    Object.fromEntries(
        statusTypes.value.map(status => [status.Id, status])
    )
)

const periodsPanelRef = ref<HTMLElement | null>(null)
const periodPanelOpen = ref(false)

const isApplyingPeriod = ref(false)
const selectedPeriodValue = ref<PeriodValue | undefined>('month')

const dateRange = shallowRef<DateRange>(
    getDateRangeByPeriodValue(selectedPeriodValue.value)
)

const sortDirection = ref<SortDirection>(null)

const hiddenStatusIds = ref<number[]>([])
const hiddenStatusIdSet = computed(() => new Set(hiddenStatusIds.value))

const filters = computed<DocumentFilters>(() => ({
  ExecutorIds: selectedExecutorId.value ? [selectedExecutorId.value] : undefined,
  DateSince: dateRange.value ? formatDateToISO(dateRange.value.start) : undefined,
  DateTill: dateRange.value ? formatDateToISO(dateRange.value.end) : undefined,
}))

const {documents} = await useDocuments(filters, {scope: 'private-page'})

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

  if (sortDirection.value) {
    cards.sort((a, b) => {
      if (sortDirection.value === 'asc') {
        return a.dateText.localeCompare(b.dateText)
      }

      return b.dateText.localeCompare(a.dateText)
    })
  }

  return {cards, chartItems}
})

const documentCards = computed(() => model.value.cards)
const documentChartItems = computed(() => model.value.chartItems)

function onChartLegendClick(payload: { statusId: number }) {
  const id = payload.statusId

  hiddenStatusIds.value = hiddenStatusIds.value.includes(id)
      ? hiddenStatusIds.value.filter(x => x !== id)
      : [...hiddenStatusIds.value, id]
}

function resetHiddenStatuses() {
  hiddenStatusIds.value = []
}

function invertHiddenStatuses() {
  const allStatusIds = documentChartItems.value.map(x => x.statusId)
  const hiddenSet = new Set(hiddenStatusIds.value)

  hiddenStatusIds.value = allStatusIds.filter(id => !hiddenSet.has(id))
}

function toggleSortOrder() {
  if (sortDirection.value === null) {
    sortDirection.value = 'desc'
  } else if (sortDirection.value === 'desc') {
    sortDirection.value = 'asc'
  } else {
    sortDirection.value = null
  }
}

onClickOutside(periodsPanelRef, () => {
  periodPanelOpen.value = false
}, {
  ignore: ['.periodPanelControl'],
})

async function selectPeriod(periodValue: PeriodValue) {
  isApplyingPeriod.value = true

  selectedPeriodValue.value = periodValue
  dateRange.value = getDateRangeByPeriodValue(periodValue)

  await nextTick()

  isApplyingPeriod.value = false
}

function isSelectedPeriod(periodValue: PeriodValue) {
  return selectedPeriodValue.value === periodValue
}

function onDateRangeUpdate(value: DateRange) {
  dateRange.value = value

  if (!isApplyingPeriod.value)
    selectedPeriodValue.value = undefined
}

function getDateRangeByPeriodValue(periodValue: PeriodValue | undefined) {
  if (periodValue === undefined)
    return

  const today = getTodayDateValue()

  switch (periodValue) {
    case 'day':
      return {
        start: today.add({days: -1}),
        end: today,
      }

    case 'week':
      return {
        start: today.add({weeks: -1}),
        end: today,
      }

    case 'month':
      return {
        start: today.add({months: -1}),
        end: today,
      }

    case 'allTime':
      return {
        start: MinimalDate,
        end: MaximalDate,
      }
  }
}
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
        <div class="relative flex w-full h-full items-center gap-1">

          <div class="flex text-lg font-semibold line-through">
            Мои документы
          </div>

          <div class="flex flex-1 h-full items-center justify-end gap-2">

            <UiAppDateRangePicker
                :model-value="dateRange"
                class="shrink-0"
                @update:model-value="onDateRangeUpdate"
            />

            <UButton
                color="neutral"
                variant="outline"
                class="periodPanelControl h-full px-2 shrink-0 flex items-center justify-center"
                @click="periodPanelOpen = !periodPanelOpen"
            >
              <UIcon
                  name="i-lucide-chevron-down"
                  class="periodPanelControl transition-transform duration-200"
                  :class="[periodPanelOpen ? 'rotate-180' : 'rotate-0']"
              />
            </UButton>

            <UTooltip
                :text="GetSortOrderByDirection(sortDirection).tooltip"
                :content="{ side: 'bottom' }"
            >
              <UButton
                  :icon="GetSortOrderByDirection(sortDirection).icon"
                  color="neutral"
                  variant="outline"
                  class="shrink-0"
                  @click="toggleSortOrder"
              />
            </UTooltip>

          </div>

          <div
              v-if="periodPanelOpen"
              ref="periodsPanelRef"
              class="absolute left-3/4 top-full z-40 mt-3 flex flex-1 max-w-300 -translate-x-1/2 rounded-xl border border-default bg-default p-4 shadow-lg"
          >

            <div
                v-for="(period, index) in Periods"
                :key="period.value"
                class="flex items-center gap-1"
            >
              <span v-if="index > 0" class="text-muted">/</span>
              <UButton
                  :label="period.label"
                  variant="link"
                  :color="isSelectedPeriod(period.value) ? 'primary' : 'neutral'"
                  size="sm"
                  @click="selectPeriod(period.value)"
              />
            </div>

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
          /*header: 'h-0 hidden'*/
        }"
    >

      <template #header>
        <USelectMenu
            v-model="selectedExecutorId"
            :items="executorItems"
            value-key="value"
            option-attribute="label"
            placeholder="Выберите исполнителя"
            class="w-full"
            clear
        />
      </template>

      <ClientOnly>
        <LazyDocumentsPrivateChartsSection
            :items="documentChartItems"
            :hidden-status-ids="hiddenStatusIds"
            @legend-click="onChartLegendClick"
        />

        <template #fallback>

          <div class="flex h-full min-h-[260px] w-full flex-col items-center justify-center gap-4 p-4">
            <USkeleton class="size-40 rounded-full"/>

            <div class="grid w-full max-w-xs grid-cols-2 gap-2">
              <div
                  v-for="i in 4"
                  :key="i"
                  class="flex items-center gap-2"
              >
                <USkeleton class="size-3 rounded-full"/>
                <USkeleton class="h-3 w-20 rounded"/>
              </div>
            </div>
          </div>

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
          <UButton
              icon="i-lucide-contrast"
              color="neutral"
              variant="ghost"
              @click="invertHiddenStatuses"
          >
            Инвертировать
          </UButton>
        </div>
      </template>


    </UCard>

  </div>
</template>

<style scoped>

</style>