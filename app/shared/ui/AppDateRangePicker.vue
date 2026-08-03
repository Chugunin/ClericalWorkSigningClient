<script setup lang="ts">
import AppDatePicker from '~/shared/ui/AppDatePicker.vue'
import {useElementSize} from '@vueuse/core'
import { getTodayDateValue, MaximalDate, MinimalDate, type DateRange } from '~/shared/lib/date/date'

const props = defineProps<{
  popoverContentClass?: string
}>()

const model = defineModel<DateRange>()

const rootRef = useTemplateRef('rootRef')
const {width} = useElementSize(rootRef)

const isCompact = computed(() => width.value > 0 && width.value < 300)

const startModel = useRangePart('start')
const endModel = useRangePart('end')

function useRangePart(part: 'start' | 'end') {
  return computed({
    get: () => model.value?.[part],
    set: (value) => {
      if (!value) {
        model.value = undefined
        return
      }

      model.value = {
        start: part === 'start'
            ? value
            : model.value?.start ?? value,

        end: part === 'end'
            ? value
            : model.value?.end ?? value,
      }
    },
  })
}

function onTodayClick() {
  const today = getTodayDateValue()

  model.value = {
    start: today,
    end: today
  }
}

function onResetClick() {
  model.value = undefined
}

</script>

<template>
  <div ref="rootRef" class="min-w-0 w-full">

    <UInputDate
        v-if="!isCompact"
        v-model="model"
        range
    >

      <template #leading>

        <UPopover
            :dismissible="true"
            :ui="{ content: props.popoverContentClass }"
        >
          <UTooltip text="Выбрать дату" :content="{ side: 'bottom' }">
            <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-calendar"
                aria-label="Выбрать дату"
                class="px-0"/>
          </UTooltip>

          <template #content>
            <div class="flex flex-col">

              <UCalendar
                  range
                  v-model="model"
                  :min-value="MinimalDate"
                  :max-value="MaximalDate"
                  variant="solid"
                  class="p-2">
              </UCalendar>

              <USeparator orientation="horizontal" size="sm"/>

              <div class="flex flex-row w-full p-1 gap-1">
                <UButton
                    class="w-full justify-center"
                    label="Сегодня"
                    variant="ghost"
                    @click="onTodayClick"
                />
                <UButton
                    class="w-full justify-center"
                    label="Сброс"
                    variant="ghost"
                    color="error"
                    @click="onResetClick"
                />
              </div>
            </div>


          </template>
        </UPopover>

      </template>

      <template #trailing>
        <UTooltip text="Сбросить дату" :content="{ side: 'bottom' }">
          <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-x"
              aria-label="Today"
              class="px-0"
              @click='onResetClick()'/>
        </UTooltip>
      </template>

    </UInputDate>

    <div
        v-else
        class="flex min-w-0 flex-col gap-1"
    >
      <div class="flex w-full">
        <AppDatePicker v-model="startModel"/>
      </div>

      <div class="flex w-full">
        <AppDatePicker v-model="endModel"/>
      </div>
      
    </div>

  </div>
</template>

<style scoped>
</style>
