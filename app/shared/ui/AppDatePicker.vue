<script setup lang="ts">
import type {DateValue} from '@internationalized/date'
import { getTodayDateValue, MaximalDate, MinimalDate } from '~/shared/lib/date/date'

const props = defineProps<{
  popoverContentClass?: string
}>()

const model = defineModel<DateValue | undefined>();

function onTodayClick() {
  model.value = getTodayDateValue()
}

function onResetClick() {
  model.value = undefined
}

</script>

<template>
  <UInputDate v-model="model">

    <template #leading>

      <UPopover
          :dismissible="true"
          :ui="{
            content: props.popoverContentClass
          }"
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
                v-model="model"
                :min-value="MinimalDate"
                :max-value="MaximalDate"
                variant="solid"
                class="p-2"/>

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
</template>

<style scoped>

</style>
