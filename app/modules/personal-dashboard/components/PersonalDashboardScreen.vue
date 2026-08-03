<script setup lang="ts">
import { computed, nextTick, ref, shallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { onClickOutside } from '@vueuse/core'

import { useDictionariesStore } from '~/modules/dictionaries'
import { useDocuments, type DocumentFilters } from '~/modules/document-registry'
import {
  formatDate,
  formatDateToISO,
  getTodayDateValue,
  MaximalDate,
  MinimalDate,
  Periods,
  type DateRange,
  type PeriodValue,
} from '~/shared/lib/date'
import { GetSortOrderByDirection, type SortDirection } from '~/shared/lib/sorting'
import { AppDateRangePicker } from '~/shared/ui'

import PersonalDashboardCardBoard from './PersonalDashboardCardBoard.vue'
import PersonalDashboardChart from './PersonalDashboardChart.vue'
import {
  buildPersonalDashboardModel,
  getNextDashboardSortDirection,
  invertDashboardStatuses,
  toggleDashboardStatus,
} from '../model/personal-dashboard.model'

const dictionariesStore = useDictionariesStore()
const {
  persons,
  documentOriginTypes,
  documentStatusTypes,
} = storeToRefs(dictionariesStore)

type ExecutorItem = {
  label: string
  value: number
}

const executorItems = computed<ExecutorItem[]>(() =>
  persons.value.map(item => ({
    label: item.Name,
    value: item.Id,
  })),
)

const selectedExecutorId = ref<number>()
const periodsPanelRef = ref<HTMLElement | null>(null)
const periodPanelOpen = ref(false)
const isApplyingPeriod = ref(false)
const selectedPeriodValue = ref<PeriodValue | undefined>('month')
const dateRange = shallowRef<DateRange | undefined>(
  getDateRangeByPeriodValue(selectedPeriodValue.value),
)
const sortDirection = ref<SortDirection>(null)
const hiddenStatusIds = ref<number[]>([])

const filters = computed<DocumentFilters>(() => ({
  ExecutorIds: selectedExecutorId.value ? [selectedExecutorId.value] : undefined,
  DateSince: dateRange.value ? formatDateToISO(dateRange.value.start) : undefined,
  DateTill: dateRange.value ? formatDateToISO(dateRange.value.end) : undefined,
}))

const { documents } = await useDocuments(filters, { scope: 'personal-dashboard' })

const normalizedStatusTypes = computed(() =>
    documentStatusTypes.value.map(item => ({
      id: item.Id,
      name: item.Name,
    })),
)

const normalizedOriginTypes = computed(() =>
    documentOriginTypes.value.map(item => ({
      id: item.Id,
      name: item.Name,
    })),
)

const normalizedPersons = computed(() =>
    persons.value.map(item => ({
      id: item.Id,
      name: item.Name,
    })),
)

const model = computed(() => buildPersonalDashboardModel({
  documents: documents.value,
  statusTypes: normalizedStatusTypes.value,
  originTypes: normalizedOriginTypes.value,
  persons: normalizedPersons.value,
  hiddenStatusIds: hiddenStatusIds.value,
  sortDirection: sortDirection.value,
  formatDate,
}))

const documentCards = computed(() => model.value.cards)
const documentChartItems = computed(() => model.value.chartItems)

function onChartLegendClick(payload: { statusId: number }): void {
  hiddenStatusIds.value = toggleDashboardStatus(hiddenStatusIds.value, payload.statusId)
}

function resetHiddenStatuses(): void {
  hiddenStatusIds.value = []
}

function invertHiddenStatuses(): void {
  hiddenStatusIds.value = invertDashboardStatuses(
    documentChartItems.value,
    hiddenStatusIds.value,
  )
}

function toggleSortOrder(): void {
  sortDirection.value = getNextDashboardSortDirection(sortDirection.value)
}

onClickOutside(periodsPanelRef, () => {
  periodPanelOpen.value = false
}, {
  ignore: ['.periodPanelControl'],
})

async function selectPeriod(periodValue: PeriodValue): Promise<void> {
  isApplyingPeriod.value = true
  selectedPeriodValue.value = periodValue
  dateRange.value = getDateRangeByPeriodValue(periodValue)
  await nextTick()
  isApplyingPeriod.value = false
}

function isSelectedPeriod(periodValue: PeriodValue): boolean {
  return selectedPeriodValue.value === periodValue
}

function onDateRangeUpdate(value: DateRange): void {
  dateRange.value = value
  if (!isApplyingPeriod.value) selectedPeriodValue.value = undefined
}

function getDateRangeByPeriodValue(periodValue: PeriodValue | undefined): DateRange | undefined {
  if (periodValue === undefined) return undefined

  const today = getTodayDateValue()

  switch (periodValue) {
    case 'day':
      return { start: today.add({ days: -1 }), end: today }
    case 'week':
      return { start: today.add({ weeks: -1 }), end: today }
    case 'month':
      return { start: today.add({ months: -1 }), end: today }
    case 'allTime':
      return { start: MinimalDate, end: MaximalDate }
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

            <AppDateRangePicker
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

      <PersonalDashboardCardBoard
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
        <PersonalDashboardChart
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
