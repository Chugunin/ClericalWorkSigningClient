<script setup lang="ts">

import type {SigningDocumentFilters} from "#shared/types/data/signing-document-filters";

useHead({
  title: 'Контроль согласования'
})

const { documents, status: documentsStatus, error: documentsError, refresh } = await useDocuments()

const {
  departments,
  persons,
  statusTypes,
  status: dictionariesStatus,
  error: dictionariesError
} = await useDictionaries()

const filters = reactive<SigningDocumentFilters>({
  search: null,
  dateSince: null,
  dateTill: null,
  statusIds: [],
  executorIds: [],
})

const statusItems = computed(() =>
    statusTypes.value.map(item => ({
      label: item.Description ?? item.Name ?? `#${item.Id}`,
      value: item.Id
    }))
)

const executorItems = computed(() =>
    persons.value.map(item => ({
      label: `${item.Rank ?? ''} ${item.Name} (${item.Post ?? ''})`,
      value: item.Id
    }))
)

const departmentItems= computed(() =>
    departments.value.map(item => ({
      label: item.Name,
      value: item.Id
    }))
)

const personById = computed(() => new Map(persons.value.map(p => [p.Id, p])))
const departmentById = computed(() => new Map(departments.value.map(d => [d.Id, d])))
const statusById = computed(() => new Map(statusTypes.value.map(s => [s.Id, s])))

const filteredDocuments = computed(() => documents)

const isLoading = computed(() =>
    documentsStatus.value === 'pending' || dictionariesStatus.value === 'pending'
)

const hasError = computed(() => Boolean(documentsError.value || dictionariesError.value))

function resetFilters() {
  filters.search = null
  filters.dateSince = null
  filters.dateTill = null
  filters.statusIds = []
  filters.executorIds = []
}

</script>

<template>
  <div class="flex h-full min-h-0 flex-col gap-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Контроль согласования</h1>
        <p class="text-sm text-muted">
          Просмотр и фильтрация документов по статусу, исполнителю и дате.
        </p>
      </div>

      <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="soft"
          @click="refresh"
      >
        Обновить
      </UButton>
    </div>

    <DocumentsControlFilters
        v-model="filters"
        :status-options="statusItems"
        :department-options="departmentItems"
        @reset="resetFilters"
    />

    <UAlert
        v-if="hasError"
        color="error"
        variant="soft"
        title="Не удалось загрузить данные"
        description="Проверь доступность API и попробуй обновить страницу."
    />

    <UCard v-else class="min-h-0 flex-1">
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div class="text-sm text-muted">
            Найдено документов: {{ filteredDocuments.value.length }}
          </div>
        </div>
      </template>

      <div v-if="isLoading" class="space-y-2">
        <USkeleton class="h-10 w-full" />
        <USkeleton class="h-10 w-full" />
        <USkeleton class="h-10 w-full" />
      </div>

<!--      <DocumentsControlTable
          v-else
          :documents="filteredDocuments"
          :status-by-id="statusById"
          :person-by-id="personById"
          :department-by-id="departmentById"
      />-->
    </UCard>
  </div>
</template>

<style scoped>

</style>