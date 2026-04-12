<script setup lang="ts">
import {CalendarDate, type DateValue} from '@internationalized/date'
import {getTodayDateValue} from "~/utils/date";

const props = defineProps<{
  popoverContentClass?: string
}>()

const targetDate = defineModel<DateValue | undefined>();

const minDate: DateValue = new CalendarDate(2000, 1, 1);
const maxDate: DateValue = getTodayDateValue();

function onResetClick() {
  targetDate.value = undefined;
}

function onTodayClick() {
  targetDate.value = getTodayDateValue();
}

</script>

<template>
  <UInputDate v-model="targetDate">

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
                v-model="targetDate"
                :min-value="minDate"
                :max-value="maxDate"
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
</template>

<style scoped>

</style>
