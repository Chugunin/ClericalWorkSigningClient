<script setup lang="ts">

import {onClickOutside} from '@vueuse/core'
import {
  useDictionariesStore,
  type Department,
  type DocumentStatusType,
  type Person,
} from '~/modules/dictionaries'
import {
  DocumentsFilters,
  DocumentsTable,
  useDocuments,
  type Document,
  type DocumentFilters,
} from '~/modules/document-registry'
import {
  hasControlFilters,
  paginateControlDocuments,
  resetControlFilters,
} from '../model/document-control.model'

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

const filtersChanged = computed(() => hasControlFilters(filters))

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

const filteredDocuments = computed<Document[]>(() => documents.value)
const pagination = computed(() => paginateControlDocuments(filteredDocuments.value, page.value, pageSize.value))
const totalDocuments = computed(() => pagination.value.total)
const paginatedDocuments = computed(() => pagination.value.items)

watch(totalDocuments, (total) => {
  const maxPage = Math.max(1, Math.ceil(total / pageSize.value))

  if (page.value > maxPage) {
    page.value = maxPage
  }
})

const isLoading = computed(() => isDocumentsLoading.value || dictionariesStore.isLoading)
const hasError = computed(() => Boolean(documentsError.value || dictionariesStore.error))

function resetFilters() {
  resetControlFilters(filters)
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

    <UCard
v-else
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
            <DocumentsFilters
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
        <DocumentsTable
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
            {{ pagination.from }}
            –
            {{ pagination.to }}
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