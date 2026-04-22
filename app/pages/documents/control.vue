<script setup lang="ts">

import {onClickOutside} from '@vueuse/core'
import type {Document} from "#shared/types/contracts/responses/documents/document";
import type {DocumentFilters} from "#shared/types/contracts/requests/filters/document-filters";
import type {DocumentStatusType} from "#shared/types/contracts/responses/dictionaries/document-status-type";
import type {Person} from "#shared/types/contracts/responses/dictionaries/person";
import type {Department} from "#shared/types/contracts/responses/dictionaries/department";

useHead({
  title: 'Контроль согласования'
})

const filtersOpen = ref(false)
const filtersButtonRef = ref<HTMLElement | null>(null)
const filtersPanelRef = ref<HTMLElement | null>(null)

const {documents, status: documentsStatus, error: documentsError, refresh} = await useDocuments()

const {
  departments,
  persons,
  statusTypes,
  status: dictionariesStatus,
  error: dictionariesError
} = await useDictionaries()

const filters = shallowReactive<DocumentFilters>({
  searchText: '',
  dateSince: undefined,
  dateTill: undefined,
  statusIds: [],
  executorIds: [],
})

const filtersChanged = computed(() => {
  return (filters.searchText?.length ?? 0) !== 0
      || filters.statusIds?.length !== 0
      || filters.executorIds?.length !== 0
      || filters.dateSince != null
      || filters.dateTill != null
})

const statusItems = computed(() =>
    statusTypes.value.map(item => ({
      label: item.Description ?? item.Name ?? `#${item.Id}`,
      value: item.Id
    }))
)

const executorItems = computed(() =>
    persons.value.map(item => ({
      label: `${item.Name}`,
      value: item.Id
    }))
)

const departmentItems = computed(() =>
    departments.value.map(item => ({
      label: item.Name,
      value: item.Id
    }))
)

const statusById = computed<Map<number, DocumentStatusType>>(
    () => new Map(statusTypes.value.map(item => [item.Id, item]))
)

const personById = computed<Map<number, Person>>(
    () => new Map(persons.value.map(item => [item.Id, item]))
)

const departmentById = computed<Map<number, Department>>(
    () => new Map(departments.value.map(item => [item.Id, item]))
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

const isLoading = computed(() =>
    documentsStatus.value === 'pending' || dictionariesStatus.value === 'pending'
)

const hasError = computed(() =>
    Boolean(documentsError.value || dictionariesError.value)
)

function resetFilters() {
  filters.searchText = ''
  filters.dateSince = undefined
  filters.dateTill = undefined
  filters.statusIds = []
  filters.executorIds = []
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
