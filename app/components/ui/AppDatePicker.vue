<script setup lang="ts">
import {CalendarDate, getLocalTimeZone, today} from '@internationalized/date'

const targetDate = defineModel<CalendarDate>();
const datePicker = useTemplateRef('datePicker');

function onTodayClick() {
  targetDate.value = new CalendarDate(
      today(getLocalTimeZone()).year,
      today(getLocalTimeZone()).month,
      today(getLocalTimeZone()).day);
}

</script>

<template>
  <UInputDate ref="datePicker" v-model="targetDate" locale="ru-RU">
    <template #leading>
      <UPopover :reference="datePicker?.inputsRef[3]?.$el" :dismissible="true">
        <UTooltip text="Выбрать дату" :content="{ side: 'bottom' }">
          <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-calendar"
              aria-label="Select a date"
              class="px-0"/>
        </UTooltip>
        <template #content>
          <UCalendar v-model="targetDate" class="p-2" locale="ru-RU"/>
        </template>
      </UPopover>
    </template>
    <template #trailing>
      <UTooltip text="Сбросить на текущую дату" :content="{ side: 'bottom' }">
        <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-x"
            aria-label="Today"
            class="px-0"
            @click='onTodayClick()'/>
      </UTooltip>
    </template>
  </UInputDate>
</template>

<style scoped>

</style>