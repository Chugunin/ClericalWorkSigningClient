<script setup lang="ts">

import {GetSortOrderByDirection} from "~/utils/sort";
import {MaximalDate, MinimalDate, Periods} from "~/utils/date";
import {onClickOutside} from "@vueuse/core";

const periodsPanelRef = ref<HTMLElement | null>(null)
const periodPanelOpen = ref(false)

const isApplyingPeriod = ref(false)
const selectedPeriodValue = ref<PeriodValue | undefined>('month')

const dateRange = shallowRef<DateRange>(
    getDateRangeByPeriodValue(selectedPeriodValue.value)
)

const sortDirection = ref<SortDirection>(null)

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
  <div class="flex min-h-0 w-full flex-1 flex-col">
    <UCard
        class="min-h-0 w-full flex-1"
        :ui="{
          root: 'flex h-full min-h-0 flex-col overflow-hidden',
          body: 'min-h-0 flex-1 overflow-hidden'
        }"
    >
      <template #header>
        <div class="w-full flex-1 text-center">
          Документы на согласование
        </div>
      </template>

      <div class="w-full h-full flex-1 flex-col overflow-hidden">
        <div class="items-center justify-center gap-2">

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
      </div>

    </UCard>
  </div>
</template>

<style scoped>

</style>