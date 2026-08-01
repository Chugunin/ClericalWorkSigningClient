<script setup lang="ts">

import {onClickOutside} from '@vueuse/core'
import type { Document, DocumentFilters, DocumentStatusType, Person, Department } from '#shared/types'

import { useDictionariesStore } from '~/stores/dictionaries.store'
import { useDocuments } from '~/composables/api/useDocuments'

const dictionariesStore = useDictionariesStore()

if (!dictionariesStore.isLoaded) {
  dictionariesStore.fetchDictionaries()
}

const filtersOpen = ref(false)
const filtersButtonRef = ref<HTMLElement | null>(null)
const filtersPanelRef = ref<HTMLElement | null>(null)

const { documents, isLoading: isDocumentsLoading, error: documentsError, refresh } = useDocuments()

const filters = shallowReactive<DocumentFilters>({
  SearchText: '',
  DateSince: undefined,
  DateTill: undefined,
  StatusIds: [],
  ExecutorIds: [],
})

const filtersChanged = computed(() => {
  return (filters.SearchText?.length ?? 0) !== 0
      || filters.StatusIds?.length !== 0
      || filters.ExecutorIds?.length !== 0
      || !!filters.DateSince
      || !!filters.DateTill
})

const statusItems = computed(() => dictionariesStore.documentStatusTypes.map(item => ({
  label: item.Description ?? item.Name ?? `#${item.Id}`,
  value: item.Id
})))

const executorItems = computed(() => dictionariesStore.persons.map(item => ({
  label: `${item.Name}`,
  value: item.Id
})))

const departmentItems = computed(() => dictionariesStore.departments.map(item => ({
  label: item.Name,
  value: item.Id
})))

const statusById = computed<Map<number, DocumentStatusType>>(
    () => new Map(dictionariesStore.documentStatusTypes.map(item => [item.Id, item]))
)

const personById = computed<Map<number, Person>>(
    () => new Map(dictionariesStore.persons.map(item => [item.Id, item]))
)

const departmentById = computed<Map<number, Department>>(
    () => new Map(dictionariesStore.departments.map(item => [item.Id, item]))
)

const page = ref(1)
const pageSize = ref(10)

const totalDocuments = computed(() => filteredDocuments.value.length)

const filteredDocuments = computed<Document[]>(() => documents.value)

const paginatedDocuments = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value

  return filteredDocuments.value.slice(start, end)
})

watch(totalDocuments, (total) => {
  const maxPage = Math.max(1, Math.ceil(total / pageSize.value))

  if (page.value > maxPage) {
    page.value = maxPage
  }
})

const isLoading = computed(() => isDocumentsLoading.value || dictionariesStore.isLoading)
const hasError = computed(() => Boolean(documentsError.value || dictionariesStore.error))

function resetFilters() {
  filters.SearchText = ''
  filters.DateSince = undefined
  filters.DateTill = undefined
  filters.StatusIds = []
  filters.ExecutorIds = []
}

async function refreshDocuments() {
  await refresh()
}

onClickOutside(filtersPanelRef, () => {
  filtersOpen.value = false
}, {
  ignore: [filtersButtonRef, '.documents-control-filters-floating'],
})

</script>

<template>
  <div class="flex h-full min-h-0 flex-col gap-4">

    <UAlert
        v-if="hasError"
        color="error"
        variant="soft"
        title="Не удалось загрузить данные"
        description="Проверь доступность API и попробуй обновить страницу."
    />

    <UCard v-else
           class="min-h-0 flex-1"
           :ui="{
             root: 'relative min-h-0 flex h-full flex-col overflow-visible',
             body: 'min-h-0 flex flex-1 flex-col',
             header: 'relative py-3 overflow-visible',
             footer: 'py-3'
           }"
    >

      <template #header>

        <div class="relative">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <span ref="filtersButtonRef" class="inline-flex">
              <UChip :show="filtersChanged">
                <UButton
                    icon="i-lucide-sliders-horizontal"
                    color="neutral"
                    variant="outline"
                    size="md"
                    class="min-w-36 justify-center"
                    @click="filtersOpen = !filtersOpen"
                >
                  Фильтры
                </UButton>
              </UChip>
            </span>

            <UButton
                icon="i-lucide-refresh-cw"
                color="primary"
                variant="outline"
                size="md"
                class="min-w-36 justify-center"
                @click="refreshDocuments"
            >
              Обновить
            </UButton>
          </div>

          <div
              v-if="filtersOpen"
              ref="filtersPanelRef"
              class="absolute left-1/2 top-full z-40 mt-3 w-[calc(100%-1rem)] max-w-300 -translate-x-1/2 rounded-xl border border-default bg-default p-4 shadow-lg"
          >
            <DocumentsControlFilters
                v-model="filters"
                :status-options="statusItems"
                :executor-options="executorItems"
                :department-options="departmentItems"
                @reset="resetFilters"
            />
          </div>
        </div>

      </template>

      <div class="min-h-0 flex-1 overflow-auto">
        <DocumentsControlTable
            :documents="paginatedDocuments"
            :status-by-id="statusById"
            :person-by-id="personById"
            :department-by-id="departmentById"
            :loading="isLoading"
        />
      </div>

      <template #footer>

        <div class="flex items-center justify-between gap-4">
          <div class="text-sm text-muted">
            Показано
            {{ totalDocuments === 0 ? 0 : (page - 1) * pageSize + 1 }}
            –
            {{ Math.min(page * pageSize, totalDocuments) }}
            из {{ totalDocuments }}
          </div>

          <UPagination
              v-model:page="page"
              :items-per-page="pageSize"
              :total="totalDocuments"
          />
        </div>

      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>