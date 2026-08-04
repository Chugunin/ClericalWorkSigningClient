<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'

import { useDocuments, type Document } from '~/modules/document-registry'
import { AppDateRangePicker } from '~/shared/ui'
import { GetSortOrderByDirection, type SortDirection } from '~/shared/lib/sorting'
import {
  type DateRange,
  formatDate,
  getTodayDateValue,
} from '~/shared/lib/date'

import { useDocumentSigningSelection } from '../composables/useDocumentSigningSelection'

const searchText = ref('')
const sortDirection = ref<SortDirection>('desc')

const dateRange = shallowRef<DateRange>(
  getDefaultDateRange(),
)

const documentFilters = computed(() => ({
  SearchText: searchText.value.trim(),
  DateSince: dateRange.value?.start?.toString(),
  DateTill: dateRange.value?.end?.toString(),
}))

const {
  documents,
  isLoading,
  error,
  refresh,
} = useDocuments(documentFilters, {
  scope: 'document-signing',
})

const { selectedDocument, selectDocument } = useDocumentSigningSelection()

const visibleDocuments = computed(() => {
  const items = [...documents.value]

  if (sortDirection.value === null) {
    return items
  }

  return items.sort((left, right) => {
    const leftTime = Date.parse(left.CreatedDate ?? '') || 0
    const rightTime = Date.parse(right.CreatedDate ?? '') || 0
    return sortDirection.value === 'asc'
      ? leftTime - rightTime
      : rightTime - leftTime
  })
})

function toggleSortOrder(): void {
  if (sortDirection.value === null) {
    sortDirection.value = 'desc'
  }
  else if (sortDirection.value === 'desc') {
    sortDirection.value = 'asc'
  }
  else {
    sortDirection.value = null
  }
}

function onDateRangeUpdate(value: DateRange): void {
  dateRange.value = value
}

function getDefaultDateRange(): DateRange {
  const today = getTodayDateValue()
  return {
    start: today.add({ months: -1 }),
    end: today,
  }
}

function hasSigningFile(document: Document): boolean {
  return Boolean(document.Id && document.Files?.some(file => file.FileEntryId))
}

function isSelected(document: Document): boolean {
  return Boolean(document.Id && selectedDocument.value?.Id === document.Id)
}

function chooseDocument(document: Document): void {
  if (!hasSigningFile(document)) {
    return
  }

  selectDocument(document)
}
</script>

<template>
  <div class="flex min-h-0 w-full flex-1 flex-col">
    <UCard
      class="min-h-0 w-full flex-1"
      :ui="{
        root: 'flex h-full min-h-0 flex-col overflow-hidden',
        body: 'flex min-h-0 flex-1 flex-col overflow-hidden p-0 sm:p-0',
      }"
    >
      <template #header>
        <div class="w-full text-center font-medium">
          Документы на подписание
        </div>
      </template>

      <div class="flex shrink-0 flex-col gap-2 border-b border-default p-3">
        <UInput
          v-model="searchText"
          icon="i-lucide-search"
          placeholder="Поиск документов"
          @keyup.enter="refresh()"
        />

        <div class="flex items-center gap-2">
          <AppDateRangePicker
            :model-value="dateRange"
            class="min-w-0 flex-1"
            @update:model-value="onDateRangeUpdate"
          />

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

          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            :loading="isLoading"
            @click="refresh()"
          />
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-2">
        <div
          v-if="isLoading"
          class="flex h-full min-h-40 items-center justify-center text-muted"
        >
          <UIcon name="i-lucide-loader-circle" class="size-7 animate-spin" />
        </div>

        <UAlert
          v-else-if="error"
          color="error"
          variant="soft"
          icon="i-lucide-circle-alert"
          title="Не удалось загрузить документы"
          class="m-2"
        />

        <div
          v-else-if="visibleDocuments.length === 0"
          class="flex h-full min-h-40 flex-col items-center justify-center px-4 text-center text-sm text-muted"
        >
          <UIcon name="i-lucide-files" class="mb-2 size-9" />
          <div>Документы по выбранным условиям не найдены.</div>
        </div>

        <div v-else class="space-y-2">
          <button
            v-for="document in visibleDocuments"
            :key="document.Id ?? document.Name"
            type="button"
            class="w-full rounded-lg border p-3 text-left transition"
            :class="[
              isSelected(document)
                ? 'border-primary bg-primary/10 ring-1 ring-primary'
                : 'border-default bg-default hover:bg-elevated',
              !hasSigningFile(document) ? 'cursor-not-allowed opacity-60' : '',
            ]"
            :disabled="!hasSigningFile(document)"
            @click="chooseDocument(document)"
          >
            <div class="flex items-start gap-3">
              <UIcon
                name="i-lucide-file-text"
                class="mt-0.5 size-5 shrink-0"
                :class="isSelected(document) ? 'text-primary' : 'text-muted'"
              />

              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-medium text-highlighted">
                  {{ document.Name }}
                </div>
                <div v-if="document.Description" class="mt-1 line-clamp-2 text-xs text-muted">
                  {{ document.Description }}
                </div>
                <div class="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
                  <span>{{ formatDate(document.CreatedDate) || 'Дата не указана' }}</span>
                  <span>
                    {{ hasSigningFile(document) ? 'PDF доступен' : 'Нет файла' }}
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </UCard>
  </div>
</template>
