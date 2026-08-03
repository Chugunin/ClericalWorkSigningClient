This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: app/**/*
- Files matching these patterns are excluded: **/.git/**, **/node_modules/**, **/.nuxt/**, **/.output/**, **/dist/**, **/coverage/**, **/bin/**, **/obj/**, **/.idea/**, **/.vscode/**, **/*.png, **/*.jpg, **/*.jpeg, **/*.gif, **/*.svg, **/*.ico, **/*.woff, **/*.woff2, **/*.dll, **/*.exe, **/*.zip, **/package-lock.json, **/pnpm-lock.yaml, **/yarn.lock
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Long base64 data strings (e.g., data:image/png;base64,...) have been truncated to reduce token count

# Directory Structure
```
.repomix/
app/
  api/
    api-client.ts
    auth.api.ts
    dictionaries.api.ts
    documents.api.ts
    files.api.ts
  assets/
    css/
      main.css
  components/
    documents/
      control/
        ControlScreen.vue
      create/
        CreateDocumentForm.vue
        CreateDocumentModal.vue
        CreateForm.vue
        CreateFormActions.vue
        CreateFormFilesSection.vue
        CreateFormMainSection.vue
        CreateFormSignersSection.vue
        CreateScreen.vue
        SignerSelection.vue
      list/
        DocumentsFilters.vue
        DocumentsTable.vue
      private/
        PrivateCardBoardSection.vue
        PrivateChartsSection.vue
        PrivateScreen.vue
      signing/
        SigningListSection.vue
        SigningMainSection.vue
        SigningScreen.vue
        SigningViewerSection.vue
    file/
      InlineViewer.vue
      Viewer.vue
    layout/
      AppHeader.vue
      AppSidebarMenu.vue
      AppThreePaneShell.vue
    modal/
      CreateDocumentModal.vue
    ui/
      AppDatePicker.vue
      AppDateRangePicker.vue
      AppModal.vue
      AppTextInput.vue
      FancyBox.vue
      Gallery.vue
  composables/
    api/
      useApiError.ts
      useDocuments.ts
      useFileEntries.ts
      useLoading.ts
      usePhysicalFile.ts
    documents/
      create/
        useFormDocuments.ts
        useFormFiles.ts
    ui/
      useAppToast.ts
  constants/
  layouts/
    documents/
      create-layout.vue
    default.vue
    login-layout.vue
  middleware/
    auth.global.ts
  pages/
    documents/
      control.vue
      create.vue
      private.vue
      signing.vue
    index.vue
    login.vue
  services/
  stores/
    auth.ts
    dictionaries.store.ts
  types/
    documents/
      create/
        form-model.ts
      private/
        card-item-model.ts
        chart-item-model.ts
    models/
      document-origin-type-model.ts
      person-model.ts
      person-role-model.ts
  utils/
    color.ts
    date.ts
    document-filters.utils.ts
    error.utils.ts
    file.ts
    sort.ts
  app.config.ts
  app.vue
docs/
  architecture/
NotebookLM/
server/
  api/
    auth/
    physical-file/
  utils/
shared/
  types/
    api/
    auth/
    dictionaries/
    documents/
    files/
```

# Files

## File: app/api/api-client.ts
```typescript
import type { ApiResponse } from '#shared/types'

export class ApiError extends Error {
    readonly status?: number

    constructor(message: string, status?: number) {
        super(message)

        this.name = 'ApiError'
        this.status = status
    }
}

export async function apiClient<T>(
    request: string,
    options?: Parameters<typeof $fetch>[1]
): Promise<T> {
    try {
        const response = await $fetch<ApiResponse<T>>(request, options)

        if (!response.success) {
            throw new ApiError(response.error ?? 'Unknown API error')
        }

        return response.data
    }
    catch (error: any) {
        if (error instanceof ApiError)
            throw error

        throw new ApiError(
            error?.data?.message ??
            error?.message ??
            'Network error',
            error?.status
        )
    }
}
```

## File: app/api/auth.api.ts
```typescript
import {
    LoginRequest,
    LoginResponse,
    CurrentUser
} from '#shared/types'

import { apiClient } from './api-client'

export const AuthApi = {

    async login(
        credentials: LoginRequest
    ): Promise<LoginResponse> {

        return await apiClient<LoginResponse>(
            '/api/auth/login',
            {
                method: 'POST',
                body: credentials
            }
        )
    },

    async getMe(
        token: string
    ): Promise<CurrentUser> {

        return await apiClient<CurrentUser>(
            '/api/auth/me',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

}
```

## File: app/api/dictionaries.api.ts
```typescript
import { apiClient } from './api-client'
import type { DictionariesResponse } from '#shared/types'

export const DictionariesApi = {
    async getAll(): Promise<DictionariesResponse> {
        return await apiClient<DictionariesResponse>('/api/dictionaries')
    }
}
```

## File: app/api/documents.api.ts
```typescript
import { apiClient } from './api-client'
import type { Document, DocumentFilters, CreateDocumentRequestData } from '#shared/types'
import {hasActiveFilters} from "~/utils/filter.utils";

export const DocumentsApi = {
    async getList(filters?: DocumentFilters | null): Promise<Document[]> {

        if (hasActiveFilters(filters)) {
            return await apiClient<Document[]>('/api/documents', {
                method: 'POST',
                body: {
                    action: 'filter',
                    filters: filters
                }
            })
        }

        return await apiClient<Document[]>('/api/documents')
    },

    async create(document: CreateDocumentRequestData): Promise<Document> {
        return await apiClient<Document>('/api/documents', {
            method: 'POST',
            body: {
                action: 'create',
                document
            }
        })
    }
}
```

## File: app/api/files.api.ts
```typescript
import { apiClient } from './api-client'
import type { FileEntry } from '#shared/types'

export interface PhysicalFileResponse {
    url: string
    mimeType: string
}

export const FilesApi = {

    async saveEntry(
        file: File
    ): Promise<FileEntry> {

        const formData = new FormData()

        formData.append('file', file)

        return await apiClient<FileEntry>(
            '/api/file-entries',
            {
                method: 'POST',
                body: formData
            }
        )
    },

    async getPhysicalFile(
        fileId: string
    ): Promise<PhysicalFileResponse> {

        const blob = await $fetch<Blob>(
            `/api/physical-file/${fileId}`,
            {
                responseType: 'blob'
            }
        )

        return {
            url: URL.createObjectURL(blob),
            mimeType: blob.type
        }
    }

}
```

## File: app/assets/css/main.css
```css
@import "tailwindcss";
@import "@nuxt/ui";

/* Target the scrollbar itself */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

/* Style the track (background) */
::-webkit-scrollbar-track {
    background: transparent; /* Matches page background */
}

/* Style the thumb (the part you drag) */
::-webkit-scrollbar-thumb {
    background: #cbd5e1; /* Tailwind slate-300 or your theme color */
    border-radius: 10px; /* This makes it rounded */
    border: 2px solid transparent; /* Creates padding effect if track has color */
    background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8; /* Tailwind slate-400 */
}
```

## File: app/components/documents/control/ControlScreen.vue
```vue
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
```

## File: app/components/documents/create/CreateDocumentForm.vue
```vue
<script setup lang="ts">

</script>

<template>

</template>

<style scoped>

</style>
```

## File: app/components/documents/create/CreateDocumentModal.vue
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDictionariesStore } from '~/stores/dictionaries.store'
import { useFormDocuments } from '~/composables/documents/create/useFormDocuments'
import AppModal from "~/components/ui/AppModal.vue";

const isOpen = defineModel<boolean>()

// Подключаем стор из Шага 3
const dictionaries = useDictionariesStore()

// Подключаем логику отправки из Шага 4
const { submitDocument, isSubmitting } = useFormDocuments()

const formData = ref({
  name: '',
  statusId: undefined
})

const onSubmit = async () => {
  const newDoc = await submitDocument(formData.value)
  if (newDoc) {
    isOpen.value = false // Закрываем при успехе
  }
}
</script>

<template>
  <AppModal v-model="isOpen" title="Создание нового документа">

    <form @submit.prevent="onSubmit">
      <UiAppTextInput v-model="formData.name" label="Название документа" required />

      <USelectMenu
          v-model="formData.statusId"
          :options="dictionaries.documentStatusTypes"
          value-attribute="Id"
          option-attribute="Name"
          label="Статус"
      />

      <div class="mt-4 flex justify-end">
        <UButton type="submit" :loading="isSubmitting" color="primary">
          Создать
        </UButton>
      </div>
    </form>

  </AppModal>
</template>
```

## File: app/components/documents/create/CreateForm.vue
```vue
<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/create/form-model";
import type {PersonRightType} from "#shared/types/contracts/responses/dictionaries/person-right-type";
import type {DocumentOriginType} from "#shared/types/contracts/responses/dictionaries/document-origin-type";
import type {DocumentFileType} from "#shared/types/contracts/responses/dictionaries/document-file-type";
import type {PersonRoleType} from "#shared/types/contracts/responses/dictionaries/person-role-type";
import type {PersonDecisionType} from "#shared/types/contracts/responses/dictionaries/person-decision-type";
import type {Person} from "#shared/types/contracts/responses/dictionaries/person";
import type {DocumentStatusType} from "#shared/types/contracts/responses/dictionaries/document-status-type";
import type CreateFormFilesSection from "~/components/documents/create/CreateFormFilesSection.vue";

const model = defineModel<DocumentFormModel>({required: true})

const filesSectionRef = ref<InstanceType<typeof CreateFormFilesSection> | null>(null)

defineProps<{
  persons: Person[]
  rightTypes: PersonRightType[]
  roleTypes: PersonRoleType[]
  decisionTypes: PersonDecisionType[]
  fileTypes: DocumentFileType[]
  originTypes: DocumentOriginType[]
  statusTypes: DocumentStatusType[]
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

async function onSubmit() {
  model.value.files = await filesSectionRef.value?.saveAll() ?? []
  
  emit('submit')
}

function onCancel() {
  emit('cancel')
}

</script>

<template>
  <form class="flex min-h-0 w-full flex-col gap-4 overflow-hidden" @submit.prevent="onSubmit">
    <LayoutAppThreePaneShell 
        class="min-h-0 flex-1 overflow-hidden" 
        layout-state-key="documents-create-form"
        :default-sizes="[30, 30, 40]"
        :min-sizes="[30, 40, 10]"
        :is-left-panel-collapsible="false"
        :is-left-panel-resizable="false"
        :is-center-panel-collapsible="false"
        :is-right-panel-enabled="true"
    >
     
      <template #left-panel>
        <DocumentsCreateFormMainSection
            v-model="model"
            :persons="persons"
            :right-types="rightTypes"
            :role-types="roleTypes"
            :decision-types="decisionTypes"
            :origin-types="originTypes"
            :status-types="statusTypes"
        />
      </template>

      <template #center-panel>
        <DocumentsCreateFormSignersSection
            v-model="model"
            :persons="persons"
            :role-types="roleTypes"
        />
      </template>

      <template #right-panel>
        <DocumentsCreateFormFilesSection
            ref="filesSectionRef"
            v-model="model"
            :file-types="fileTypes"
        />
      </template>
      
    </LayoutAppThreePaneShell>

    <DocumentsCreateFormActions
        class="shrink-0"
        @submit="onSubmit"
        @cancel="onCancel"
    />
  </form>
  
</template>

<style scoped>

</style>
```

## File: app/components/documents/create/CreateFormActions.vue
```vue
<script setup lang="ts">

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

</script>

<template>
  <div class="flex items-center justify-end p-2 gap-3">
    <UButton color="neutral" variant="soft" @click="emit('cancel')" class="hidden">
      Отмена
    </UButton>

    <UButton @click="emit('submit')">
      Создать документ
    </UButton>
  </div>
</template>

<style scoped>

</style>
```

## File: app/components/documents/create/CreateFormFilesSection.vue
```vue
<script setup lang="ts">

import type {DocumentFormFile, DocumentFormModel} from "~/types/documents/create/form-model";
import type {DocumentFileType} from "#shared/types/contracts/responses/dictionaries/document-file-type";
import {saveFileEntry} from "~/composables/api/useFileEntries";

const model = defineModel<DocumentFormModel>({required: true})

const props = defineProps<{
  fileTypes: DocumentFileType[]
}>()

const files = ref<File[]>([])

const {
  mainFileKey,

  isMainFile,
  getPreviewUrl,

  markMainFile,
  removeFile,
  clearAll,
  saveAll,

} = useFiles(files, {
  saveFile: saveFileEntry,
})

defineExpose({
  saveAll,
  mainFileKey,
})

const fileUploadUi = computed(() => ({
  base: [
    'p-2 border-hidden focus:outline-none focus:ring-0 focus-visible:ring-0',
    files.value.length ? 'justify-start' : 'justify-center items-center'
  ].join(' '),
  root: files.value.length
      ? 'justify-start'
      : 'h-full justify-center items-center',
  files: 'md:grid-cols-2'
}))

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
        Файлы
      </template>

      <UFileUpload
          v-model="files"
          layout="grid"
          multiple
          :interactive="false"
          :highlight="false"
          label="Перетащите сюда файлы"
          class="h-full min-h-0 overflow-auto"
          :ui="fileUploadUi"
      >

        <template #actions="{ open }">

          <div v-if="!files?.length" class="flex flex-wrap gap-2">
            <UButton
                icon="i-lucide-upload"
                label="Добавить файлы"
                variant="outline"
                @click="open()"
            />
          </div>
        </template>

        <template #files-top="{ open, files }">
          <div v-if="files?.length" class="mb-2 flex items-center justify-between">
            <span class="text-md font-bold">Добавлено: {{ files?.length }}</span>

            <div class="flex items-center gap-2">

              <UTooltip text="Добавить файл">
                <UButton
                    icon="i-lucide-plus"
                    color="primary"
                    variant="outline"
                    class="-my-2"
                    @click="open()"
                />
              </UTooltip>

              <UTooltip text="Удалить все">
                <UButton
                    icon="i-lucide-trash"
                    color="error"
                    variant="outline"
                    class="-my-2"
                    @click="clearAll"
                />
              </UTooltip>
            </div>

          </div>
        </template>

        <template #file="{ file, index }">

          <div
              class="group relative text-xs gap-1.5 p-0 aspect-square border-3 rounded-lg"
              :class="isMainFile(file) ? 'border-primary' : 'border-transparent'"
          >
              <span
                  class="inline-flex items-center justify-center select-none align-middle bg-elevated text-base shrink-0 size-full rounded-lg"
              >
                
                <img
                    v-if="getPreviewUrl(file)"
                    :src="getPreviewUrl(file)"
                    data-slot="image"
                    class="h-full w-full rounded-[inherit] object-cover"
                    :alt="file.name"
                />
  
                <UIcon
                    v-else
                    :name="getFileInfo(file).icon"
                    class="text-4xl text-muted"
                />
                
              </span>

            <UBadge
                :label="getFileInfo(file).ext"
                :color="getFileInfo(file).color"
                class="absolute top-2 left-1/2 -translate-x-1/2 z-10 text-md font-bold uppercase"
                variant="solid"
            />

            <div class="absolute inset-x-0 bottom-0 z-10 p-2">
              <UTooltip
                  :text="file.name"
                  :disabled="file.name.length < 20"
                  :ui="{ content: 'max-w-xs break-words' }"
              >
                <div class="w-full rounded bg-inverted/75 px-2 py-1 text-xs text-inverted truncate">
                  {{ file.name }}
                </div>
              </UTooltip>
            </div>

            <div
                class="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              <UTooltip
                  text="Удалить файл"
                  :ui="{ content: 'max-w-xs break-words' }"
              >
                <UButton
                    variant="solid"
                    size="xl"
                    class="pointer-events-auto absolute -top-1.5 -left-1.5 z-10 gap-1 rounded-full border-2 border-default bg-accented/85 p-0 text-default/75 hover:bg-inverted hover:text-inverted active:bg-accented/85 active:text-default/75"
                    @click.stop="removeFile(index)"
                >
                  <UIcon name="i-lucide-x" class="pointer-events-none"/>
                </UButton>
              </UTooltip>

              <UTooltip
                  text="Отметить основным"
                  :ui="{ content: 'max-w-xs break-words' }"
              >
                <UButton
                    variant="solid"
                    size="xl"
                    class="pointer-events-auto absolute -top-1.5 -right-1.5 z-10 gap-1 rounded-full border-2 border-default bg-accented/85 p-0 text-default/75 hover:bg-inverted hover:text-inverted active:bg-accented/85 active:text-default/75"
                    :class="isMainFile(file) ? 'border-primary text-primary' : ''"
                    @click.stop="markMainFile(index)"
                >
                  <UIcon name="i-lucide-check" class="pointer-events-none"/>
                </UButton>
              </UTooltip>
            </div>

          </div>
        </template>

      </UFileUpload>

    </UCard>
  </div>
</template>

<style scoped>

</style>
```

## File: app/components/documents/create/CreateFormMainSection.vue
```vue
<script setup lang="ts">

import type {Person} from "#shared/types/contracts/responses/dictionaries/person";
import type {DocumentOriginType} from "#shared/types/contracts/responses/dictionaries/document-origin-type";
import type {DocumentFormModel} from "~/types/documents/create/form-model";

const model = defineModel<DocumentFormModel>({required: true})

const props = defineProps<{
  persons: Person[]
  originTypes: DocumentOriginType[]
}>()

const originTypeItems = computed(() =>
    props.originTypes.map(item => ({
      label: item.Description,
      value: item.Id,
    })),
)

const executorItems = computed(() =>
    props.persons.map(item => ({
      label: `${item.Name}`,
      value: item.Id,
    })),
)

</script>

<template>
  <UCard
      class="min-h-0 w-full flex-1"
      :ui="{
        root: 'flex h-full min-h-0 flex-col overflow-hidden',
        body: 'min-h-0 flex-1'
      }"
  >
    <template #header>
      Основная информация
    </template>

    <div class="space-y-4">
      <UFormField label="Кто согласовывает" class="shrink-0">
        <USelectMenu
            v-model="model.executorId"
            :items="executorItems"
            value-key="value"
            option-attribute="label"
            placeholder="Выберите исполнителя"
            class="w-full"
            clear
        />
      </UFormField>

      <UFormField label="Что согласовывается" class="shrink-0">
        <USelectMenu
            v-model="model.originId"
            :items="originTypeItems"
            value-key="value"
            option-attribute="label"
            placeholder="Выберите тип документа"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'min-w-fit' }"
            :searchInput="false"
            class="w-full"
            clear
        />
      </UFormField>

      <UFormField label="Реквизиты" class="shrink-0">
        <div class="flex flex-col items-center gap-2">
          <UiAppTextInput
              v-model="model.name"
              variant="soft"
              type="text"
              placeholder="Введите название документа"
              class="w-full"
          />
          <div class="flex flex-row justify-between w-full gap-2">
            <UBadge
                label="Дата документа"
                color="primary"
                variant="soft"
            />
            <UiAppDatePicker
                v-model="model.date"
                variant="outline"
                class="w-full justify-center"
            />
          </div>
          <UTextarea
              v-model="model.description"
              placeholder="Введите описание документа"
              class="w-full"
              :rows="4"
              
              autoresize
          />
        </div>
      </UFormField>

    </div>

  </UCard>
</template>

<style scoped>

</style>
```

## File: app/components/documents/create/CreateFormSignersSection.vue
```vue
<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/create/form-model";
import type {Person} from "#shared/types/contracts/responses/dictionaries/person";
import type {PersonRoleType} from "#shared/types/contracts/responses/dictionaries/person-role-type";

interface SignerItem {
  isChecked: boolean
  label: string
  value: number
  roleId?: number
}

interface RoleItem {
  label: string
  value: number
}

const model = defineModel<DocumentFormModel>({required: true})

const props = defineProps<{
  persons: Person[]
  roleTypes: PersonRoleType[]
}>()

const signerItems = ref<SignerItem[]>(
    props.persons.map(item => ({
      isChecked: false,
      label: `${item.Name}`,
      value: item.Id,
      roleId: undefined,
    }))
)

const roleItems = computed<RoleItem[]>(() =>
    props.roleTypes.map(item => ({
      label: `${item.Description}`,
      value: item.Id,
    })),
)

const filterText = ref('')

const hasSelectedSignerItems = computed(() =>
    signerItems.value.some(item => item.isChecked),
)

const filteredSignerItems = computed(() => {
  return signerItems.value
      .filter(i => i.label.toLowerCase().includes(filterText.value.toLowerCase()))
      .sort((a, b) => {
        const aHasSelectedRole = a.isChecked && a.roleId != null
        const bHasSelectedRole = b.isChecked && b.roleId != null

        return Number(bHasSelectedRole) - Number(aHasSelectedRole)
      })
})

watch(signerItems, syncSignerIdsWithModel, {deep: true, immediate: true})

function setSignerItemChecked(item: SignerItem, isChecked: boolean) {
  item.isChecked = isChecked

  if (!item.isChecked)
    item.roleId = undefined
}

function toggleSignerItem(item: SignerItem) {
  setSignerItemChecked(item, !item.isChecked)
}

function clearSignerItemsSelection() {
  signerItems.value.forEach(item => setSignerItemChecked(item, false))
}

function syncSignerIdsWithModel() {
  model.value.signerIds = signerItems.value
      .flatMap(item => {
        if (!item.isChecked || item.roleId == null)
          return []

        return [{
          signerId: item.value,
          roleId: item.roleId,
        }]
      })
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
        С кем согласовывается
      </template>

      <UFormField
          class="signers-field h-full min-h-0"
          :ui="{
            root: 'flex h-full min-h-0 flex-col overflow-hidden',
            wrapper: 'shrink-0'
          }"
      >
        <div class="flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden">
          <div class="flex shrink-0 gap-2">
            
            <UiAppTextInput
                v-model="filterText"
                class="min-w-0 flex-1"
                color="neutral"
                variant="soft"
                type="text"
                placeholder="Начните вводить имя сотрудника"
            />

            <UTooltip text="Очистить выделение">
              <UButton
                  class="shrink-0"
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-x"
                  :disabled="!hasSelectedSignerItems"
                  @click="clearSignerItemsSelection"
              />  
            </UTooltip>

          </div>

          <div class="min-h-0 flex-1 overflow-y-auto">
            <ul class="flex min-h-0 flex-col gap-2">
              <li v-for="signerItem in filteredSignerItems" :key="signerItem.value">

                <div class="flex flex-row p-2 gap-2 items-center border border-accented rounded-lg"
                     :class="[signerItem.isChecked ? 'border-primary' : 'border-accented']"
                     @click="toggleSignerItem(signerItem)"
                >

                  <div class="min-w-0 w-full pl-1 text-left truncate cursor-default">
                    {{ signerItem.label }}
                  </div>

                  <USelectMenu v-model="signerItem.roleId"
                               :items="roleItems"
                               value-key="value"
                               label-key="label"
                               placeholder="Выберите роль"
                               size="sm"
                               :variant="signerItem.isChecked ? 'subtle' : 'ghost'"
                               :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'min-w-fit' }"
                               :disabled="!signerItem.isChecked"
                               :search-input="false"
                               clear
                               clearable
                               @click.stop
                  />

                </div>

              </li>
            </ul>
          </div>
        </div>
      </UFormField>

    </UCard>
  </div>
</template>

<style scoped>
:deep(.signers-field > div:last-child) {
  min-height: 0;
  flex: 1 1 0%;
  overflow: hidden;
}
</style>
```

## File: app/components/documents/create/CreateScreen.vue
```vue
<script setup lang="ts">
import type {DocumentFormModel} from '~/types/documents/create/form-model'
import {formatDate} from '~/utils/date'
import { useDictionariesStore } from '~/stores/dictionaries.store'

const dictionariesStore = useDictionariesStore()
// Проверяем, загружены ли словари
if (!dictionariesStore.isLoaded) {
  dictionariesStore.fetchDictionaries()
}

const emit = defineEmits<{
  closeContainer: []
}>()

const {
  persons,
  rightTypes,
  roleTypes,
  decisionTypes,
  fileTypes,
  originTypes,
  statusTypes,
  status,
  error,
} = await useDictionaries()

const model = shallowReactive<DocumentFormModel>({
  name: '',
  date: undefined,
  description: '',
  statusId: undefined,
  originId: undefined,
  executorId: undefined,
  signerIds: [],
})

const toast = useAppToast()
const isSubmitting = ref(false)

async function handleSubmit() {
  toast.clear()

  const messages = validateFormDocument(model)

  toast.showMany(messages, 5000, true)

  if (messages.some(message => message.level === 'error'))
    return

  try {
    isSubmitting.value = true

    const document = await saveFormDocument(model)

    toast.show({
      text: `Документ ${document.Name} от ${formatDate(document.CreatedDate)} создан`,
      level: 'success'
    }, 3000)

    emit('closeContainer')
  } catch (error) {
    const text = error instanceof Error ? error.message : 'Не удалось создать документ'
    toast.show({text, level: 'error'})
  } finally {
    isSubmitting.value = false
  }
}

function handleCancel() {
  console.log('cancel', model)
}
</script>

<template>
  <div class="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden">
    <div v-if="status === 'pending'" class="min-h-0 flex-1">
      Загрузка словарей...
    </div>

    <div v-else-if="error" class="min-h-0 flex-1">
      Ошибка загрузки словарей
    </div>

    <DocumentsCreateForm
      v-else
      v-model="model"
      class="min-h-0 flex-1"
      :persons="persons"
      :right-types="rightTypes"
      :role-types="roleTypes"
      :decision-types="decisionTypes"
      :origin-types="originTypes"
      :status-types="statusTypes"
      :file-types="fileTypes"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
```

## File: app/components/documents/create/SignerSelection.vue
```vue
<script setup lang="ts">

</script>

<template>

</template>

<style scoped>

</style>
```

## File: app/components/documents/list/DocumentsFilters.vue
```vue
<script setup lang="ts">

import type { DocumentFilters } from '#shared/types'
import type {DateValue} from "@internationalized/date"
import {formatDateToISO} from "~/utils/date"

interface OptionItem {
  label: string
  value: number
}

const model = defineModel<DocumentFilters>({required: true});

const dateSince = ref<DateValue | undefined>()
const dateTill = ref<DateValue | undefined>()

watch(dateSince, () => {
  model.value.DateSince = formatDateToISO(dateSince.value)
})

watch(dateTill, () => {
  model.value.DateTill = formatDateToISO(dateTill.value)
})

const props = withDefaults(defineProps<{
  statusOptions: OptionItem[]
  executorOptions: OptionItem[]
  departmentOptions: OptionItem[]
}>(), {
  statusOptions: () => [],
  executorOptions: () => [],
  departmentOptions: () => [],
});

const emit = defineEmits<{
  reset: []
}>();

function getSelectMenuToolTipText(origins: OptionItem[], values: number[] | undefined) {
  if (origins?.length !== 0 && values?.length !== 0)
    return origins
        .filter(o => values!.includes(o.value))
        .map(o => `[${o.label}]`)
        .join(', ');

  return 'Не выбран';
}

const statusesTooltipText = computed(() => {
  return getSelectMenuToolTipText(props.statusOptions, model.value.StatusIds);
});

const executorsTooltipText = computed(() => {
  return getSelectMenuToolTipText(props.executorOptions, model.value.ExecutorIds);
});

</script>

<template>
  <div class="space-y-4">

    <div class="flex items-center justify-between gap-3">
      <div class="text-sm font-medium">Фильтры</div>

      <UButton
          size="sm"
          color="error"
          variant="outline"
          icon="i-lucide-rotate-ccw"
          @click="emit('reset')"
      >
        Сбросить
      </UButton>
    </div>

    <div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">

      <UFormField label="Поиск" class="p-2 min-w-0">
        <UChip :show="model.SearchText?.length !== 0" class="w-full min-w-0">
          <UTooltip :text="model.SearchText ?? 'Пусто'" :content="{ side: 'bottom' }">
            <UiAppTextInput
                v-model="model.SearchText"
                variant="outline"
                class="w-full min-w-0"
                icon="i-lucide-search"
                placeholder-text="Название, описание, ID"
            />
          </UTooltip>
        </UChip>
      </UFormField>

      <UFormField label="Статус" class="p-2 min-w-0">
        <UChip :show="model.StatusIds?.length !== 0" class="w-full min-w-0">
          <UTooltip :text="statusesTooltipText" :content="{ side: 'bottom' }" arrow>
            <USelectMenu
                v-model="model.StatusIds"
                :items="props.statusOptions"
                multiple
                clear
                value-key="value"
                option-attribute="label"
                placeholder="Все статусы"
                class="w-full min-w-0"
                :content="{
                  side: 'bottom',
                  align: 'start',
                  sideOffset: 8
                }"
                :ui="{
                  content: 'z-[60] documents-control-filters-floating'
                }"
            />
          </UTooltip>
        </UChip>
      </UFormField>

      <UFormField label="Исполнитель" class="p-2 min-w-0">
        <UChip :show="model.ExecutorIds?.length !== 0" class="w-full min-w-0">
          <UTooltip :text="executorsTooltipText" :content="{ side: 'bottom' }" arrow>
            <USelectMenu
                v-model="model.ExecutorIds"
                :items="props.executorOptions"
                multiple
                clear
                value-key="value"
                option-attribute="label"
                placeholder="Все"
                class="w-full min-w-0"
                :content="{
                  side: 'bottom',
                  align: 'start',
                  sideOffset: 8
                }"
                :ui="{
                  content: 'z-[60] documents-control-filters-floating'
                }"
            />
          </UTooltip>
        </UChip>
      </UFormField>

      <UFormField label="Дата с" class="p-2 min-w-0">
        <UChip :show="!!dateSince" class="w-full min-w-0">
          <UiAppDatePicker v-model="dateSince" variant="outline" class="w-full min-w-0"
                           popover-content-class="z-[60] documents-control-filters-floating"/>
        </UChip>
      </UFormField>

      <UFormField label="Дата по" class="p-2 min-w-0">
        <UChip :show="!!dateTill" class="w-full min-w-0">
          <UiAppDatePicker v-model="dateTill" variant="outline" class="w-full min-w-0"
                           popover-content-class="z-[60] documents-control-filters-floating"/>
        </UChip>
      </UFormField>

    </div>

  </div>

</template>

<style scoped>

</style>
```

## File: app/components/documents/list/DocumentsTable.vue
```vue
<script setup lang="ts">

import type {TableColumn} from '@nuxt/ui'
import type { Document, DocumentStatusType, Person, Department } from '#shared/types'
import {UButton} from "#components"

const props = withDefaults(defineProps<{
  documents: Document[]
  statusById: Map<number, DocumentStatusType>
  personById: Map<number, Person>
  departmentById: Map<number, Department>
  loading?: boolean
}>(), {
  loading: false
})

const columns: TableColumn<Document>[] = [
  {
    accessorKey: 'Id',
    header: '#',
    cell: ({row}) => {
      const value = row.getValue('Id') as string | number | undefined
      return value ? `#${value}` : '—'
    },
  },
  {
    id: 'expand',
    cell: ({row}) =>
        h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          icon: 'i-lucide-chevron-down',
          square: true,
          'aria-label': 'Expand',
          ui: {
            leadingIcon: [
              'transition-transform',
              row.getIsExpanded() ? 'duration-200 rotate-180' : ''
            ]
          },
          onClick: () => row.toggleExpanded()
        })
  },
  {
    accessorKey: 'Name',
    header: 'Наименование документа',
    cell: ({row}) => {
      return (row.getValue('Name') as string | undefined) || '—'
    },
  },
  {
    accessorKey: 'Description',
    header: 'Содержание',
    cell: ({row}) => {
      const value = row.getValue('Description') as string | undefined
      return value || '—'
    },
    meta: {
      class: {
        td: 'max-w-[420px] truncate',
      }
    },
  },
  {
    accessorKey: 'CreatedDate',
    header: 'Дата документа',
    cell: ({row}) => {
      const value = row.getValue('CreatedDate') as string | undefined
      return formatDate(value) || '—'
    },
  },
  {
    accessorKey: 'StatusId',
    header: 'Статус',
    cell: ({row}) => {
      const statusId = row.getValue('StatusId') as number | undefined
      if (!statusId) return '—'

      const status = props.statusById.get(statusId)
      return status?.Description ?? status?.Name ?? '—'
    }
  },
  {
    accessorKey: 'ExecutorId',
    header: 'Исполнитель',
    cell: ({row}) => {
      const executorId = row.getValue('ExecutorId') as number | undefined
      if (!executorId) return '—'

      const executor = props.personById.get(executorId)
      if (!executor) return '—'

      const department = executor.DepartmentId
          ? props.departmentById.get(executor.DepartmentId)
          : undefined

      return department
          ? `${executor.Name} (${department.Name})`
          : executor.Name
    }
  },
]

const columnVisibility = ref({Id: false});

</script>

<template>
  <UTable
      :data="documents"
      :columns="columns"
      :loading="loading"
      :column-visibility="columnVisibility"
      empty="По выбранным фильтрам ничего не найдено"
      sticky="header"
      class="w-full"
  />
</template>
```

## File: app/components/documents/private/PrivateCardBoardSection.vue
```vue
<script setup lang="ts">

import type {DocumentCardItem} from "~/types/documents/private/card-item-model";

const props = withDefaults(defineProps<{
  documentCards: DocumentCardItem[] | []
  loading?: boolean
}>(), {
  loading: false
})

</script>

<template>
  <div class="h-full min-h-0 overflow-y-auto overflow-x-hidden">

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2">
      <UCard
          v-for="documentCard in documentCards"
          :key="documentCard.id"
          class="mb-4 min-w-0"
          :class="['border', documentCard.statusColor.borderClass]"
      >
        <template #header>
          <div class="flex flex-col gap-0.5 justify-stretch">

            <div class="font-medium truncate">
              {{ documentCard.name }}
            </div>

            <div class="font-medium text-muted">
              от {{ documentCard.dateText }}
            </div>

            <UBadge variant="solid" class="justify-center"
                    :class="[documentCard.statusColor.bgClass, documentCard.statusColor.textClass]">
              <span class="font-bold text-sm">{{ documentCard.statusText }}</span>
            </UBadge>

          </div>
        </template>

        <div class="flex flex-col justify-start gap-2 whitespace-pre-line wrap-break-word">

          <div class="flex flex-col">
            <span>Описание:</span>
            <span class="text-sm text-muted">
                  {{ documentCard.description ?? '[пусто]' }}
                </span>
          </div>

        </div>

      </UCard>
    </div>

    <!--    <template #fallback>
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <USkeleton
                v-for="i in 8"
                :key="i"
                class="h-48 w-full rounded-xl"
            />
          </div>
        </template>-->

  </div>
</template>
```

## File: app/components/documents/private/PrivateChartsSection.vue
```vue
<script setup lang="ts">

import {ArcElement, Chart, type ChartData, type ChartOptions, Legend, PieController, Tooltip} from "chart.js";
import type {DocumentChartItem} from "~/types/documents/private/chart-item-model";

Chart.register(PieController, ArcElement, Tooltip, Legend)

const props = defineProps<{
  items: DocumentChartItem[]
  hiddenStatusIds: number[]
}>()

const emit = defineEmits<{
  legendClick: [
    payload: {
      statusId: number
      label: string
      index: number
    }
  ]
}>()

const itemsAmount = computed(() =>
    props.items
        .filter(x => !props.hiddenStatusIds.includes(x.statusId))
        .map(x => x.count)
        .reduce((a, b) => a + b, 0))

const colorMode = useColorMode()
const colorProbeRef = ref<HTMLElement | null>(null)
const legendFontColor = ref('currentColor')

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'pie'> | null = null

const chartData = computed<ChartData<'pie'>>(() => ({
  labels: props.items.map(x => `${x.label} (${x.count})`),
  datasets: [
    {
      label: 'Документы',
      data: props.items.map(x => x.count),
      backgroundColor: props.items.map(x => x.color.chartColor ?? '#999999'),
      borderWidth: 2,
    }
  ]
}))

const chartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  devicePixelRatio: 2,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: legendFontColor.value,
      },
      onClick(e, legendItem) {
        const index = legendItem.index

        if (index === undefined) {
          return
        }

        const item = props.items[index]

        if (!item) {
          return
        }

        emit('legendClick', {
          statusId: item.statusId,
          label: item.label,
          index,
        })
      },
    },
    tooltip: {
      callbacks: {
        title(context) {
          return ''
        },
        label(context) {
          const label = context.label ?? ''
          //const value = context.parsed ?? 0

          return `${label}`
        }
      }
    }
  }
}

function syncHiddenStatuses(update = true) {
  if (!chart) {
    return
  }

  props.items.forEach((item, index) => {
    const shouldBeVisible = !props.hiddenStatusIds.includes(item.statusId)
    const isVisible = chart!.getDataVisibility(index)

    if (shouldBeVisible !== isVisible) {
      chart!.toggleDataVisibility(index)
    }
  })

  if (update) {
    chart.update('none')
  }
}

watch(
    () => props.hiddenStatusIds,
    () => {
      syncHiddenStatuses(true)
    },
    {deep: true}
)

function renderChart() {
  if (!canvasRef.value) {
    return
  }

  chart = new Chart(canvasRef.value, {
    type: 'pie',
    data: chartData.value,
    options: chartOptions
  })
}

function updateChart() {
  if (!chart) {
    return
  }

  chart.data.labels = chartData.value.labels
  chart.data.datasets = chartData.value.datasets

  syncHiddenStatuses(false)

  chart.update('none')
}

function readLegendColor() {
  if (!colorProbeRef.value) {
    return
  }

  legendFontColor.value = getComputedStyle(colorProbeRef.value).color
}

function applyLegendColor() {
  if (!chart) {
    return
  }

  chart.options.plugins!.legend!.labels!.color = legendFontColor.value
  chart.options.borderColor = legendFontColor.value
  chart.update('none')
}

onMounted(async () => {
  await nextTick()

  readLegendColor()

  renderChart()

  applyLegendColor()
})

watch(chartData, () => {
  updateChart()
}, {deep: true})

watch(legendFontColor, () => {
  applyLegendColor()
})

watch(() => colorMode.value,
    async () => {
      await nextTick()
      readLegendColor()
    }
)

onBeforeUnmount(() => {
  chart?.destroy()
  chart = null
})

</script>

<template>

  <span
      ref="colorProbeRef"
      class="text-default hidden"
  />

  <div class="relative w-full h-full min-h-[260px]">
    <div class="w-full items-center text-center">Всего: {{ itemsAmount }}</div>
    <canvas ref="canvasRef"/>
  </div>

</template>

<style scoped>

</style>
```

## File: app/components/documents/private/PrivateScreen.vue
```vue
<script setup lang="ts">

import type {DocumentFilters} from "#shared/types/contracts/requests/filters/document-filters";
import {formatDate, MaximalDate, MinimalDate, Periods} from "~/utils/date";
import type {DocumentCardItem} from "~/types/documents/private/card-item-model";
import {getDocumentStatusColor} from "~/utils/color";
import type {DocumentChartItem} from "~/types/documents/private/chart-item-model";
import type {DateValue} from "@internationalized/date";
import type {BreadcrumbItem} from "#ui/components/Breadcrumb.vue";
import {onClickOutside} from "@vueuse/core";
import {GetSortOrderByDirection} from "~/utils/sort";

const {
  persons,
  rightTypes,
  roleTypes,
  decisionTypes,
  fileTypes,
  originTypes,
  statusTypes,
  status,
  error,
} = await useDictionaries()

type ExecutorItem = {
  label: string;
  value: number;
}

const executorItems = computed(() =>
    persons.value.map(item => (
        {
          label: `${item.Name}`,
          value: item.id,
        })) as ExecutorItem[],
)

const selectedExecutorId = ref<number>()

const statusTypeById = computed(() =>
    Object.fromEntries(
        statusTypes.value.map(status => [status.id, status])
    )
)

const periodsPanelRef = ref<HTMLElement | null>(null)
const periodPanelOpen = ref(false)

const isApplyingPeriod = ref(false)
const selectedPeriodValue = ref<PeriodValue | undefined>('month')

const dateRange = shallowRef<DateRange>(
    getDateRangeByPeriodValue(selectedPeriodValue.value)
)

const sortDirection = ref<SortDirection>(null)

const hiddenStatusIds = ref<number[]>([])
const hiddenStatusIdSet = computed(() => new Set(hiddenStatusIds.value))

const filters = computed<DocumentFilters>(() => ({
  ExecutorIds: selectedExecutorId.value ? [selectedExecutorId.value] : undefined,
  DateSince: dateRange.value ? formatDateToISO(dateRange.value.start) : undefined,
  DateTill: dateRange.value ? formatDateToISO(dateRange.value.end) : undefined,
}))

const {documents} = await useDocuments(filters, {scope: 'private-page'})

const model = computed(() => {
  const cards: DocumentCardItem[] = []
  const chartItems: DocumentChartItem[] = []

  Object.entries(
      Object.groupBy(
          documents.value.filter(d => d.Id && d.StatusId),
          d => d.StatusId!
      )
  ).forEach(([statusId, items]) => {
    const id = Number(statusId)
    const statusText = statusTypeById.value[id]?.Description ?? ''
    const statusColor = getDocumentStatusColor(id)

    if (!hiddenStatusIdSet.value.has(id)) {
      items?.forEach(d => {
        cards.push({
          id: d.Id!,
          name: d.Name,
          dateText: formatDate(d.CreatedDate!),
          description: d.Description,
          statusText,
          statusColor,
          originText: originTypes.value[d.OriginId!]?.Description ?? '',
          executorText: persons.value[d.ExecutorId!]?.Name ?? '',
        })
      })
    }

    chartItems.push({
      statusId: id,
      label: statusText,
      count: items?.length ?? 0,
      color: statusColor,
    })
  })

  if (sortDirection.value) {
    cards.sort((a, b) => {
      if (sortDirection.value === 'asc') {
        return a.dateText.localeCompare(b.dateText)
      }

      return b.dateText.localeCompare(a.dateText)
    })
  }

  return {cards, chartItems}
})

const documentCards = computed(() => model.value.cards)
const documentChartItems = computed(() => model.value.chartItems)

function onChartLegendClick(payload: { statusId: number }) {
  const id = payload.statusId

  hiddenStatusIds.value = hiddenStatusIds.value.includes(id)
      ? hiddenStatusIds.value.filter(x => x !== id)
      : [...hiddenStatusIds.value, id]
}

function resetHiddenStatuses() {
  hiddenStatusIds.value = []
}

function invertHiddenStatuses() {
  const allStatusIds = documentChartItems.value.map(x => x.statusId)
  const hiddenSet = new Set(hiddenStatusIds.value)

  hiddenStatusIds.value = allStatusIds.filter(id => !hiddenSet.has(id))
}

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
  <div class="flex flex-row justify-between w-full h-full p-2 gap-2 overflow-hidden">

    <UCard
        class="min-h-0 w-7/10"
        :ui="{
          root: 'flex flex-col h-full min-h-0 overflow-hidden',
          body: 'flex-1 min-h-0 overflow-auto'
        }"
    >
      <template #header>
        <div class="relative flex w-full h-full items-center gap-1">

          <div class="flex text-lg font-semibold line-through">
            Мои документы
          </div>

          <div class="flex flex-1 h-full items-center justify-end gap-2">

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

          <div
              v-if="periodPanelOpen"
              ref="periodsPanelRef"
              class="absolute left-3/4 top-full z-40 mt-3 flex flex-1 max-w-300 -translate-x-1/2 rounded-xl border border-default bg-default p-4 shadow-lg"
          >

            <div
                v-for="(period, index) in Periods"
                :key="period.value"
                class="flex items-center gap-1"
            >
              <span v-if="index > 0" class="text-muted">/</span>
              <UButton
                  :label="period.label"
                  variant="link"
                  :color="isSelectedPeriod(period.value) ? 'primary' : 'neutral'"
                  size="sm"
                  @click="selectPeriod(period.value)"
              />
            </div>

          </div>

        </div>
      </template>

      <DocumentsPrivateCardBoardSection
          :document-cards="documentCards"
      />

    </UCard>

    <UCard
        class="min-h-0 w-3/10"
        :ui="{
          root: 'flex flex-col h-full min-h-0 overflow-hidden',
          body: 'flex-1 min-h-0 items-center justify-center overflow-auto',
          /*header: 'h-0 hidden'*/
        }"
    >

      <template #header>
        <USelectMenu
            v-model="selectedExecutorId"
            :items="executorItems"
            value-key="value"
            option-attribute="label"
            placeholder="Выберите исполнителя"
            class="w-full"
            clear
        />
      </template>

      <ClientOnly>
        <LazyDocumentsPrivateChartsSection
            :items="documentChartItems"
            :hidden-status-ids="hiddenStatusIds"
            @legend-click="onChartLegendClick"
        />

        <template #fallback>

          <div class="flex h-full min-h-[260px] w-full flex-col items-center justify-center gap-4 p-4">
            <USkeleton class="size-40 rounded-full"/>

            <div class="grid w-full max-w-xs grid-cols-2 gap-2">
              <div
                  v-for="i in 4"
                  :key="i"
                  class="flex items-center gap-2"
              >
                <USkeleton class="size-3 rounded-full"/>
                <USkeleton class="h-3 w-20 rounded"/>
              </div>
            </div>
          </div>

        </template>
      </ClientOnly>

      <template #footer>
        <div class="flex items-center justify-center gap-2">
          <UButton
              icon="i-lucide-rotate-ccw"
              color="neutral"
              variant="ghost"
              :disabled="hiddenStatusIds.length === 0"
              @click="resetHiddenStatuses"
          >
            Сбросить
          </UButton>
          <UButton
              icon="i-lucide-contrast"
              color="neutral"
              variant="ghost"
              @click="invertHiddenStatuses"
          >
            Инвертировать
          </UButton>
        </div>
      </template>


    </UCard>

  </div>
</template>

<style scoped>

</style>
```

## File: app/components/documents/signing/SigningListSection.vue
```vue
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
```

## File: app/components/documents/signing/SigningMainSection.vue
```vue
<script setup lang="ts">

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
    </UCard>
  </div>
</template>

<style scoped>

</style>
```

## File: app/components/documents/signing/SigningScreen.vue
```vue
<script setup lang="ts">

const defaultPanelSizes = [25, 75, 0]

</script>

<template>
  <div class="flex min-h-0 w-full h-full flex-col gap-4 overflow-hidden">
    <LayoutAppThreePaneShell
        class="min-h-0 flex-1 overflow-hidden"
        layout-state-key="documents-signing-screen"
        :default-sizes=defaultPanelSizes
        :min-sizes="[20, 50, 0]"
        :max-sizes="[50, 100, 0]"
        :is-left-panel-collapsible="true"
        :is-left-panel-resizable="true"
        :is-center-panel-collapsible="false"
        :is-right-panel-enabled="false"
    >

      <template #left-panel>
        <DocumentsSigningListSection/>
      </template>

      <template #center-panel>
        <DocumentsSigningMainSection/>
      </template>

    </LayoutAppThreePaneShell>
  </div>
</template>

<style scoped>

</style>
```

## File: app/components/documents/signing/SigningViewerSection.vue
```vue
<script setup lang="ts">

const files = ref([
  {id: "019db3e8-0adb-726a-84de-f6533b67548e", originalName: "test1"},
  {id: "019db451-9804-70ec-9aca-5446b623b075", originalName: "test2"},
  {id: "019dbfcf-202b-7c3a-9970-cb7a2b91c4d6", originalName: "test3"}
])

const selectedFile = ref(files.value?.[0] ?? null)

</script>

<template>
  <div class="grid grid-cols-2 gap-4 h-[80vh]">
    <FileGallery
        v-model="selectedFile"
        :files="files"
        class="overflow-auto"
    />

    <FileInlineViewer
        v-if="selectedFile"
        :file-id="selectedFile.id"
        :file-name="selectedFile.originalName"
    />
  </div>
</template>

<style scoped>

</style>
```

## File: app/components/file/InlineViewer.vue
```vue
<!-- components/files/FileInlineViewer.vue -->
<script setup lang="ts">
const props = defineProps<{
  fileId: string
  fileName?: string
}>()

const loading = ref(false)
const error = ref<string | null>(null)

const fileUrl = ref<string | null>(null)
const mimeType = ref<string>('application/octet-stream')

async function loadFile() {
  loading.value = true
  error.value = null

  try {
    const result = await usePhysicalFile(props.fileId)

    fileUrl.value = result.url
    mimeType.value = result.mimeType
  } catch {
    error.value = 'Не удалось загрузить файл'
  } finally {
    loading.value = false
  }
}

const isPdf = computed(() => mimeType.value === 'application/pdf')
const isImage = computed(() => mimeType.value.startsWith('image/'))

onMounted(loadFile)

onUnmounted(() => {
  if (fileUrl.value) {
    URL.revokeObjectURL(fileUrl.value)
  }
})
</script>

<template>
  <div class="h-full min-h-0 rounded-lg border border-default overflow-hidden">
    <div
        v-if="loading"
        class="h-full flex items-center justify-center"
    >
      <UIcon name="i-lucide-loader-2" class="animate-spin size-6"/>
    </div>

    <div
        v-else-if="error"
        class="h-full flex items-center justify-center text-error"
    >
      {{ error }}
    </div>

    <iframe
        v-else-if="fileUrl && isPdf"
        :src="fileUrl"
        class="h-full w-full"
    />

    <img
        v-else-if="fileUrl && isImage"
        :src="fileUrl"
        :alt="fileName"
        class="max-h-full max-w-full object-contain mx-auto"
    >

    <div
        v-else
        class="h-full flex flex-col items-center justify-center gap-2 text-muted"
    >
      <UIcon name="i-lucide-file" class="size-10"/>
      <div>{{ fileName ?? 'Файл' }}</div>
      <div class="text-sm">Предпросмотр недоступен</div>
    </div>
  </div>
</template>
```

## File: app/components/file/Viewer.vue
```vue
<script setup lang="ts">
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

const props = withDefaults(defineProps<{
  fileId: string
  fileName?: string
  buttonLabel?: string
}>(), {
  buttonLabel: 'Открыть',
})

const toast = useToast()

const loading = ref(false)
const objectUrls = new Set<string>()

async function openFile() {
  loading.value = true

  try {
    const { url, mimeType } = await usePhysicalFile(props.fileId)

    objectUrls.add(url)

    if (mimeType === 'application/pdf') {
      Fancybox.show([
        {
          src: url,
          type: 'iframe',
          caption: props.fileName,
        },
      ])
      return
    }

    if (mimeType.startsWith('image/')) {
      Fancybox.show([
        {
          src: url,
          type: 'image',
          caption: props.fileName,
        },
      ])
      return
    }

    window.open(url, '_blank')
  } catch (error) {
    console.error(error)

    toast.add({
      title: 'Ошибка открытия файла',
      description: props.fileName
          ? `Не удалось открыть файл "${props.fileName}"`
          : 'Не удалось открыть файл',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  objectUrls.forEach(URL.revokeObjectURL)
  objectUrls.clear()
})
</script>

<template>
  <UButton
      icon="i-lucide-eye"
      variant="ghost"
      size="xs"
      :loading="loading"
      @click="openFile"
  >
    {{ buttonLabel }}
  </UButton>
</template>
```

## File: app/components/layout/AppHeader.vue
```vue
<script setup lang="ts">

defineProps<{
  sidebarCollapsed: boolean
}>()

const emit = defineEmits<{
  toggleSidebar: []
}>()

const authStore = useAuthStore()

</script>

<template>
  <UDashboardNavbar>

    <template #leading>
      <UDashboardSidebarCollapse
          :icon="sidebarCollapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
          color="neutral"
          variant="ghost"
          @click="emit('toggleSidebar')"
      />
    </template>
    
    <template #title>
      СПО Согласование документов
    </template>

    <template #right>
      <UColorModeButton/>
      <UButton
          label="Выход"
          trailing-icon="i-lucide-square-arrow-right-exit"
          variant="solid"
          color="error"
          @click="authStore.logout()"/>
    </template>

  </UDashboardNavbar>
</template>

<style scoped>

</style>
```

## File: app/components/layout/AppSidebarMenu.vue
```vue
<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const props = withDefaults(defineProps<{
  collapsed: boolean
  pendingSigningCount?: number
  myDocumentsCount?: number
}>(), {
  pendingSigningCount: 0,
  myDocumentsCount: 0,
})

const menuItems = computed<NavigationMenuItem[][]>(() => [[
  {
    search: "Private",
    label: 'Личная страница',
    icon: 'i-lucide-user-round',
    to: '/documents/private',
    badge: props.myDocumentsCount > 0
        ? {
          label: String(props.myDocumentsCount),
          color: 'warning',
          variant: 'soft',
        }
        : undefined,
    chip: props.collapsed && props.myDocumentsCount > 0
        ? {
          color: 'warning',
          inset: true,
        }
        : false,
    tooltip: props.collapsed ? {text: 'Мои документы'} : false,
  },
  {
    search: "Signing",
    label: 'Согласование',
    icon: 'i-lucide-signature',
    to: '/documents/signing',
    badge: props.pendingSigningCount > 0
        ? {
          label: String(props.pendingSigningCount),
          color: 'warning',
          variant: 'soft',
        }
        : undefined,
    chip: props.collapsed && props.pendingSigningCount > 0
        ? {
          color: 'warning',
          inset: true,
        }
        : false,
    tooltip: props.collapsed ? {text: 'Согласование'} : false,
  },
  {
    search: "SigningControl",
    label: 'Контроль согласования',
    icon: 'i-lucide-network',
    to: '/documents/control',
    tooltip: props.collapsed ? {text: 'Контроль согласования'} : false,
  }
]])

</script>

<template>
  <UNavigationMenu
      :items="menuItems"
      orientation="vertical"
      variant="link"
      highlight
      tooltip
      :collapsed="collapsed"
      class="w-full">
  </UNavigationMenu>
</template>

<style scoped>

</style>
```

## File: app/components/layout/AppThreePaneShell.vue
```vue
<script setup lang="ts">
import {SplitterGroup, SplitterPanel, SplitterResizeHandle} from 'reka-ui'

const props = withDefaults(defineProps<{
  defaultSizes?: [number, number, number] | number[]
  minSizes?: [number?, number?, number?]
  maxSizes?: [number?, number?, number?]
  layoutStateKey?: string
  isLeftPanelResizable?: boolean
  isCenterPanelResizable?: boolean
  isRightPanelResizable?: boolean
  isLeftPanelCollapsible?: boolean
  isCenterPanelCollapsible?: boolean
  isRightPanelCollapsible?: boolean
  isRightPanelEnabled?: boolean
}>(), {
  defaultSizes: () => [40, 30, 30],
  minSizes: () => [undefined, 30, undefined],
  maxSizes: () => [undefined, 100, undefined],
  layoutStateKey: 'app-three-pane-shell',
  isLeftPanelResizable: true,
  isCenterPanelResizable: true,
  isRightPanelResizable: true,
  isLeftPanelCollapsible: true,
  isCenterPanelCollapsible: true,
  isRightPanelCollapsible: true,
  isRightPanelEnabled: true,
})

const layout = useState<number[] | null>(
    `splitter:layout:${props.layoutStateKey}`,
    () => null,
)

const fallbackLayout = computed(() => {
  return props.isRightPanelEnabled
      ? normalizeLayout(props.defaultSizes)
      : normalizeLayout(props.defaultSizes.slice(0, 2))
})

const fallbackGridColumns = computed(() => {
  const columns: string[] = []

  fallbackLayout.value.forEach((size, index) => {
    // сама панель
    columns.push(`${size}fr`)

    // handle между панелями
    if (index < fallbackLayout.value.length - 1) {
      columns.push('0.25rem')
    }
  })

  return columns.join(' ')
})

const isMounted = ref(false)
const initialLayout = ref<number[]>([])

const panelsCount = computed(() => props.isRightPanelEnabled ? 3 : 2)

const minSizes = computed(() => normalizeSizes(props.minSizes))
const maxSizes = computed(() => normalizeSizes(props.maxSizes))

const splitterKey = computed(() => [
  props.layoutStateKey,
  props.isRightPanelEnabled ? 'with-right' : 'without-right',
  initialLayout.value.join('-'),
].join(':'))

const leftPanel = useTemplateRef('leftPanelRef')
const centerPanel = useTemplateRef('centerPanelRef')
const rightPanel = useTemplateRef('rightPanelRef')

onMounted(async () => {
  const sourceLayout = layout.value ?? props.defaultSizes

  initialLayout.value = normalizeLayout(
      props.isRightPanelEnabled
          ? sourceLayout
          : sourceLayout.slice(0, 2),
  )

  await nextTick()

  isMounted.value = true

  await nextTick()

  if (props.isRightPanelEnabled && initialLayout.value[2] === 0) {
    rightPanel.value?.collapse()
  }
})

function toggleLeftPanel() {
  if (!props.isLeftPanelCollapsible)
    return

  if (leftPanel.value?.isCollapsed)
    leftPanel.value.expand()
  else
    leftPanel.value?.collapse()
}

function toggleCenterPanel() {
  if (!props.isCenterPanelCollapsible)
    return

  if (centerPanel.value?.isCollapsed)
    centerPanel.value.expand()
  else
    centerPanel.value?.collapse()
}

function toggleRightPanel() {
  if (!props.isRightPanelCollapsible)
    return

  if (rightPanel.value?.isCollapsed)
    rightPanel.value.expand()
  else
    rightPanel.value?.collapse()
}

function onLayout(value: number[]) {
  if (!isMounted.value)
    return

  if (value.length !== panelsCount.value)
    return

  layout.value = normalizeLayout(value)
}

function normalizeLayout(value: number[]) {
  const fallback = props.isRightPanelEnabled
      ? [40, 30, 30]
      : [40, 60]

  const sizes = value.length === fallback.length
      ? value.map((size) => Number.isFinite(size) && size >= 0 ? size : 0)
      : fallback

  const total = sizes.reduce((sum, size) => sum + size, 0)

  if (total <= 0)
    return fallback

  return sizes.map((size) => size / total * 100)
}

function normalizeSizes(value: [number?, number?, number?]) {
  return [value[0], value[1], value[2]].map((size) => {
    if (!Number.isFinite(size))
      return undefined

    return Math.min(Math.max(size as number, 0), 100)
  })
}
</script>

<template>
  <SplitterGroup
      v-if="isMounted"
      :key="splitterKey"
      class="h-full min-h-0 w-full overflow-hidden"
      direction="horizontal"
      @layout="onLayout"
  >
    <SplitterPanel
        ref="leftPanelRef"
        class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="initialLayout[0]"
        :min-size="minSizes[0]"
        :max-size="maxSizes[0]"
        :collapsible="isLeftPanelCollapsible"
    >
      <slot name="left-panel"/>
    </SplitterPanel>

    <SplitterResizeHandle
        class="relative m-1 flex w-1 cursor-col-resize items-center justify-center bg-accented"
        :disabled="!isLeftPanelResizable || !isCenterPanelResizable"
        :class="[!isLeftPanelResizable || !isCenterPanelResizable ? 'cursor-default' : '']"
    >
      <div
          class="pointer-events-auto absolute top-1/2 z-20 flex -translate-y-1/2 flex-col items-center justify-center"
          @mousedown.stop
          @mouseenter.stop
          @mouseleave.stop
      >
        <UButton
            :class="[isLeftPanelCollapsible ? 'flex' : 'hidden']"
            class="h-16! w-3! cursor-pointer! items-center justify-center rounded-r-md p-0! shadow-sm"
            color="neutral"
            variant="outline"
            @click.stop="toggleLeftPanel"
        >
          <UIcon
              class="cursor-pointer!"
              :name="leftPanel?.isCollapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
          />
        </UButton>

        <UButton
            :class="[isCenterPanelCollapsible && isLeftPanelCollapsible ? 'flex' : 'hidden']"
            class="h-16! w-3! cursor-pointer! items-center justify-center rounded-r-md p-0! shadow-sm"
            color="neutral"
            variant="outline"
            @click.stop="toggleCenterPanel"
        >
          <UIcon
              class="cursor-pointer!"
              :name="centerPanel?.isCollapsed ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
          />
        </UButton>
      </div>
    </SplitterResizeHandle>

    <SplitterPanel
        ref="centerPanelRef"
        class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="initialLayout[1]"
        :min-size="minSizes[1]"
        :max-size="maxSizes[1]"
        :collapsible="isCenterPanelCollapsible"
    >
      <slot name="center-panel"/>
    </SplitterPanel>

    <SplitterResizeHandle
        v-if="isRightPanelEnabled"
        class="relative m-1 flex w-1 cursor-col-resize items-center justify-center bg-accented"
        :disabled="!isCenterPanelResizable || !isRightPanelResizable"
        :class="[!isCenterPanelResizable || !isRightPanelResizable ? 'cursor-default' : '']"
    >
      <div
          class="pointer-events-auto absolute top-1/2 z-20 flex -translate-y-1/2 flex-col items-center justify-center"
          @mousedown.stop
          @mouseenter.stop
          @mouseleave.stop
      >
        <UButton
            :class="[isCenterPanelCollapsible && isRightPanelCollapsible ? 'flex' : 'hidden']"
            class="h-16! w-3! cursor-pointer! items-center justify-center rounded-r-md p-0! shadow-sm"
            color="neutral"
            variant="outline"
            @click.stop="toggleCenterPanel"
        >
          <UIcon
              class="cursor-pointer!"
              :name="centerPanel?.isCollapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
          />
        </UButton>

        <UButton
            :class="[isRightPanelCollapsible ? 'flex' : 'hidden']"
            class="h-16! w-3! cursor-pointer! items-center justify-center rounded-r-md p-0! shadow-sm"
            color="neutral"
            variant="outline"
            @click.stop="toggleRightPanel"
        >
          <UIcon
              class="cursor-pointer!"
              :name="rightPanel?.isCollapsed ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
          />
        </UButton>
      </div>
    </SplitterResizeHandle>

    <SplitterPanel
        v-if="isRightPanelEnabled"
        ref="rightPanelRef"
        class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="initialLayout[2]"
        :min-size="minSizes[2]"
        :max-size="maxSizes[2]"
        :collapsible="isRightPanelCollapsible"
    >
      <slot name="right-panel"/>
    </SplitterPanel>

  </SplitterGroup>

  <div
      v-else
      class="flex h-full min-h-0 w-full overflow-hidden"
  >
    <template v-for="(size, index) in fallbackLayout" :key="index">
      <div
          class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
          :style="{ flexBasis: `${size}%`, flexGrow: size, flexShrink: 1 }"
      >
        <USkeleton class="h-full w-full rounded-lg"/>
      </div>

      <div
          v-if="index < fallbackLayout.length - 1"
          class="relative m-1 flex w-1 shrink-0 items-center justify-center bg-accented"
      />
    </template>
  </div>
</template>
```

## File: app/components/modal/CreateDocumentModal.vue
```vue
<script setup lang="ts">

const open = defineModel<boolean>('open', {required: true})

function closeModal() {
  open.value = false
}

function openInNewTab() {
  window.open('/documents/create', '_blank', 'noopener,noreferrer')
}

</script>

<template>

  <UModal
      v-model:open="open"
      :dismissible="false"
      :overlay="true"
      :close="false"
      :ui="{
        content: 'flex h-[90vh] w-[90vw] max-w-none flex-col overflow-hidden',
        body: 'min-h-0 flex-1 overflow-hidden',
        footer: 'justify-end'
      }"
  >
    <template #content>
      
      <div class="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl bg-default">
        
        <div class="flex shrink-0 items-center justify-between border-b border-default px-4 py-3">
          
          <div>
            <h2 class="text-lg font-semibold">Создание нового документа</h2>
          </div>

          <div class="flex items-center gap-2">
            <UButton
                icon="i-lucide-external-link"
                label="Открыть в новой вкладке"
                color="neutral"
                variant="soft"
                @click="openInNewTab"
            />

            <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                square
                @click="closeModal"
            />
          </div>
        </div>

        <div class="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
          <DocumentsCreateScreen v-if="open" @closeContainer="closeModal"/>
        </div>
        
      </div>
      
    </template>
  </UModal>

</template>

<style scoped>

</style>
```

## File: app/components/ui/AppDatePicker.vue
```vue
<script setup lang="ts">
import {CalendarDate, type DateValue} from '@internationalized/date'
import {getTodayDateValue} from "~/utils/date";

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
```

## File: app/components/ui/AppDateRangePicker.vue
```vue
<script setup lang="ts">
import {useElementSize} from '@vueuse/core'
import {getTodayDateValue, MaximalDate, MinimalDate} from "~/utils/date";

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
        <UiAppDatePicker v-model="startModel"/>
      </div>

      <div class="flex w-full">
        <UiAppDatePicker v-model="endModel"/>
      </div>
      
    </div>

  </div>
</template>

<style scoped>
</style>
```

## File: app/components/ui/AppModal.vue
```vue
<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-my-1" @click="isOpen = false" />
        </div>
      </template>

      <slot />

    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>()

const isOpen = defineModel<boolean>()
</script>
```

## File: app/components/ui/AppTextInput.vue
```vue
<script setup lang="ts">
import {useClipboard} from '@vueuse/core';

const props = withDefaults(defineProps<{
  placeholderText?: string
  resetVisible?: boolean
  copyVisible?: boolean
}>(), {
  placeholderText: 'Введите текст',
  resetVisible: true,
  copyVisible: false,
});

const value = defineModel<string>();
const {copy, copied} = useClipboard();

</script>

<template>
  <UInput
      v-model="value"
      :placeholder="placeholderText"
      :ui="{ trailing: 'pe-1' }"
  >

    <template v-if="value?.length" #trailing>

      <UTooltip text="Очистить поле" :content="{ side: 'bottom' }">
        <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-x"
            aria-label="Очистить поле"
            :class="resetVisible ? '' : 'hidden'"
            @click="value = ''"/>
      </UTooltip>

      <UTooltip text="Скопировать текст" :content="{ side: 'bottom' }">
        <UButton
            :color="copied ? 'success' : 'neutral'"
            variant="link"
            size="sm"
            :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            aria-label="Скопировать текст"
            :class="copyVisible ? '' : 'hidden'"
            @click="copy(value)"/>
      </UTooltip>

    </template>

  </UInput>
</template>
```

## File: app/components/ui/FancyBox.vue
```vue
<script setup lang="ts">
import {Fancybox} from '@fancyapps/ui'
import type {FancyboxOptions} from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

const props = defineProps<{
  options?: Partial<FancyboxOptions>
}>()

const container = ref<HTMLElement | null>(null)

function bind() {
  if (!container.value) return

  Fancybox.bind(container.value, '[data-fancybox]', {
    ...(props.options ?? {}),
  })
}

onMounted(bind)

onUpdated(() => {
  if (!container.value) return

  Fancybox.unbind(container.value)
  Fancybox.close()
  bind()
})

onUnmounted(() => {
  if (!container.value) return

  Fancybox.unbind(container.value)
  Fancybox.close()
})
</script>

<template>
  <div ref="container">
    <slot/>
  </div>
</template>
```

## File: app/components/ui/Gallery.vue
```vue
<!-- components/files/FileGallery.vue -->
<script setup lang="ts">
type FileItem = {
  id: string
  originalName: string
  mimeType?: string | null
}

const model = defineModel<FileItem | null>('modelValue')

const props = defineProps<{
  files: FileItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [file: FileItem]
}>()

function getIcon(file: FileItem) {
  const mime = file.mimeType ?? ''

  if (mime === 'application/pdf') return 'i-lucide-file-text'
  if (mime.startsWith('image/')) return 'i-lucide-image'
  if (mime.includes('word')) return 'i-lucide-file-type-2'
  if (mime.includes('excel') || mime.includes('spreadsheet')) return 'i-lucide-file-spreadsheet'
  if (mime.includes('powerpoint') || mime.includes('presentation')) return 'i-lucide-presentation'
  return 'i-lucide-file'
}
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
    <button
        v-for="file in files"
        :key="file.id"
        type="button"
        class="rounded-lg border border-default p-3 text-left hover:bg-muted transition"
        :class="modelValue?.id === file.id ? 'ring-2 ring-primary' : ''"
        @click="emit('update:modelValue', file)"
    >
      <div class="aspect-[4/3] flex items-center justify-center rounded-md bg-muted mb-2">
        <UIcon
            :name="getIcon(file)"
            class="size-10 text-muted"
        />
      </div>

      <div class="text-sm truncate">
        {{ file.originalName }}
      </div>
    </button>
  </div>
</template>
```

## File: app/composables/api/useApiError.ts
```typescript
import { ApiError } from "~/api/api-client"

export function useApiError() {

    function getMessage(error: unknown): string {

        if (error instanceof ApiError)
            return error.message

        if (error instanceof Error)
            return error.message

        return "Неизвестная ошибка"

    }

    return {

        getMessage

    }

}
```

## File: app/composables/api/useDocuments.ts
```typescript
import { ref, watch } from 'vue'
import { DocumentsApi } from '~/api/documents.api'
import type { Document, DocumentFilters } from '#shared/types'

export const useDocuments = () => {
    // Реактивные фильтры
    const filters = ref<DocumentFilters>({
        SearchText: '',
        StatusIds: [],
        ExecutorIds: [],
        DateSince: undefined,
        DateTill: undefined
    })

    // Используем useAsyncData для корректного SSR
    const {
        data: documents,
        pending: isLoading,
        error,
        refresh
    } = useAsyncData<Document[]>(
        'documents-list',
        () => DocumentsApi.getList(filters.value),
        {
            default: () => [],
            // watch: [filters] // Можно раскомментировать, если хотите, чтобы таблица обновлялась при каждом чихе в фильтрах
        }
    )

    // Метод для ручного применения фильтров (например, по кнопке "Найти")
    const applyFilters = async () => {
        await refresh()
    }

    // Метод для очистки фильтров
    const clearFilters = async () => {
        filters.value = {
            SearchText: '',
            StatusIds: [],
            ExecutorIds: [],
            DateSince: undefined,
            DateTill: undefined
        }
        await refresh()
    }

    return {
        documents,
        isLoading,
        error,
        filters,
        applyFilters,
        clearFilters,
        refresh
    }
}
```

## File: app/composables/api/useFileEntries.ts
```typescript
import { ref } from 'vue'

import { FilesApi } from '~/api/files.api'

import { useApiError } from '~/composables/api/useApiError'
import { useLoading } from '~/composables/api/useLoading'

import type { FileEntry } from '#shared/types'

export const useFileEntries = () => {

    const loader = useLoading()
    const apiError = useApiError()

    const uploadError = ref<string | null>(null)

    const uploadFile = async (
        file: File,
    ): Promise<FileEntry | null> => {

        uploadError.value = null

        return loader.execute(async () => {

            try {

                return await FilesApi.saveEntry(file)

            }
            catch (error) {

                uploadError.value = apiError.getMessage(error)

                return null

            }

        })

    }

    return {

        uploadFile,

        isUploading: loader.loading,

        uploadError,

    }

}
```

## File: app/composables/api/useLoading.ts
```typescript
export function useLoading() {

    const loading = ref(false)

    async function execute<T>(
        action: () => Promise<T>
    ): Promise<T> {

        loading.value = true

        try {

            return await action()

        }
        finally {

            loading.value = false

        }

    }

    return {

        loading,

        execute

    }

}
```

## File: app/composables/api/usePhysicalFile.ts
```typescript
export async function usePhysicalFile(fileId: string) {
    const blob = await $fetch<Blob>(`/api/physical-file/${fileId}`, {
        responseType: 'blob',
    })

    const url = URL.createObjectURL(blob)

    return {
        url,
        mimeType: blob.type,
    }
}
```

## File: app/composables/documents/create/useFormDocuments.ts
```typescript
import { ref } from 'vue'
import { DocumentsApi } from '~/api/documents.api'
import { useApiError } from '~/composables/api/useApiError'
import { useLoading } from '~/composables/api/useLoading'
import { useAppToast } from '~/composables/ui/useAppToast'

import type {
    CreateDocumentRequestData,
    Document,
} from '#shared/types'

export const useFormDocuments = () => {

    const loader = useLoading()
    const apiError = useApiError()
    const toast = useAppToast()

    const error = ref<string | null>(null)

    const submitDocument = async (
        payload: CreateDocumentRequestData,
    ): Promise<Document | null> => {

        error.value = null

        return loader.execute(async () => {

            try {

                const created = await DocumentsApi.create(payload)

                toast.success(
                    `Документ "${created.Name}" успешно создан.`,
                )

                return created

            }
            catch (e) {

                error.value = apiError.getMessage(e)

                toast.error(error.value)

                return null

            }

        })

    }

    return {

        submitDocument,

        isSubmitting: loader.loading,

        error,

    }

}
```

## File: app/composables/documents/create/useFormFiles.ts
```typescript
import {computed, onBeforeUnmount, ref, watch, type Ref} from 'vue'
import type {DocumentFormFile} from "~/types/documents/create/form-model";
import type {FileEntry} from "#shared/types";

export interface UseFilesOptions {
    saveFile?: (file: File) => Promise<FileEntry>
}

export interface UseFilesReturn {
    mainFileKey: Ref<string | null>
    previewMap: Ref<Record<string, string>>

    hasFiles: Readonly<Ref<boolean>>
    mainFile: Readonly<Ref<File | null>>

    fileKey: (file: File) => string
    isMainFile: (file: File) => boolean
    getPreviewUrl: (file: File) => string | undefined

    markMainFile: (index: number) => void
    removeFile: (index: number) => void
    clearAll: () => void
    saveAll: () => Promise<DocumentFormFile[]>
}

export function useFiles(
    files: Ref<File[] | undefined>,
    options: UseFilesOptions = {},
): UseFilesReturn {
    const mainFileKey = ref<string | null>(null)
    const previewMap = ref<Record<string, string>>({})

    function fileKey(file: File): string {
        return `${file.name}_${file.size}_${file.lastModified}_${file.type}`
    }

    function isMainFile(file: File): boolean {
        return mainFileKey.value === fileKey(file)
    }

    function getPreviewUrl(file: File): string | undefined {
        return previewMap.value[fileKey(file)]
    }

    function getFileByIndex(index: number): File | null {
        const currentFiles = files.value ?? []
        return currentFiles[index] ?? null
    }

    function markMainFile(index: number): void {
        const file = getFileByIndex(index)
        if (!file) return

        mainFileKey.value = fileKey(file)
    }

    function removeFile(index: number): void {
        const currentFiles = files.value ?? []
        const fileToRemove = currentFiles[index]

        if (!fileToRemove) return

        const removedKey = fileKey(fileToRemove)
        const nextFiles = currentFiles.filter((_, i) => i !== index)

        files.value = nextFiles

        if (!nextFiles.length) {
            mainFileKey.value = null
            return
        }

        if (mainFileKey.value === removedKey) {
            const firstFile = nextFiles[0]
            mainFileKey.value = firstFile ? fileKey(firstFile) : null
        }
    }

    function clearAll(): void {
        files.value = []
        mainFileKey.value = null
    }

    const hasFiles = computed(() => (files.value?.length ?? 0) > 0)

    const mainFile = computed<File | null>(() => {
        const currentFiles = files.value ?? []
        if (!currentFiles.length || !mainFileKey.value) return null

        return currentFiles.find(f => fileKey(f) === mainFileKey.value) ?? null
    })

    watch(
        files,
        (newFiles = []) => {
            const nextPreviewMap: Record<string, string> = {}

            for (const file of newFiles) {
                const key = fileKey(file)

                if (previewMap.value[key]) {
                    nextPreviewMap[key] = previewMap.value[key]
                    continue
                }

                if (file.type.startsWith('image/')) {
                    nextPreviewMap[key] = URL.createObjectURL(file)
                }
            }

            for (const [key, url] of Object.entries(previewMap.value)) {
                if (!nextPreviewMap[key]) {
                    URL.revokeObjectURL(url)
                }
            }

            previewMap.value = nextPreviewMap
        },
        {deep: true, immediate: true},
    )

    watch(
        files,
        (newFiles = []) => {
            if (!newFiles.length) {
                mainFileKey.value = null
                return
            }

            const firstFile = newFiles[0]
            if (!firstFile) {
                mainFileKey.value = null
                return
            }

            if (!mainFileKey.value) {
                mainFileKey.value = fileKey(firstFile)
                return
            }

            const mainStillExists = newFiles.some(file => fileKey(file) === mainFileKey.value)

            if (!mainStillExists) {
                mainFileKey.value = fileKey(firstFile)
            }
        },
        {deep: true, immediate: true},
    )

    onBeforeUnmount(() => {
        for (const url of Object.values(previewMap.value)) {
            URL.revokeObjectURL(url)
        }
    })

    async function saveAll(): Promise<DocumentFormFile[]> {
        if (!options.saveFile) {
            throw new Error('saveFile handler is not provided')
        }

        const fileEntries: DocumentFormFile[] = []
        
        const currentFiles = files.value ?? []

        for (const currentFile of currentFiles) {

            try {
                const currentFileEntry = await options.saveFile(currentFile)
                
                if (currentFileEntry.Id) {
                    fileEntries.push(
                        {
                            fileEntryId: currentFileEntry.Id,
                            typeId: isMainFile(currentFile) ? 1 : 3
                        })
                }
                
            } catch (error) {
                throw error
            }
        }
        
        return fileEntries
    }

    return {
        mainFileKey,
        previewMap,

        hasFiles,
        mainFile,

        fileKey,
        isMainFile,
        getPreviewUrl,

        markMainFile,
        removeFile,
        clearAll,

        saveAll,
    }
}
```

## File: app/composables/ui/useAppToast.ts
```typescript
export type AppToastLevel = 'error' | 'warning' | 'info' | 'success'

export interface AppToastMessage {
    text: string
    level: AppToastLevel
}

const LEVEL_META = {
    error: {
        title: 'Ошибка',
        color: 'error',
        icon: 'i-lucide-circle-alert',
    },
    warning: {
        title: 'Предупреждение',
        color: 'warning',
        icon: 'i-lucide-circle-alert',
    },
    info: {
        title: 'Информация',
        color: 'info',
        icon: 'i-lucide-circle-alert',
    },
    success: {
        title: 'Успешно',
        color: 'success',
        icon: 'i-lucide-circle-check',
    },
} as const

export function useAppToast() {
    const toast = useToast()

    function show(message: AppToastMessage, duration = 3000, useProgress = false) {
        const meta = LEVEL_META[message.level]
        const id = Date.now().toString()

        toast.add({
            id: id,
            title: meta.title,
            description: message.text,
            color: meta.color,
            icon: meta.icon,
            duration: useProgress ? duration : 0,
            close: true,
            progress: useProgress,
        })

        if (!useProgress) {
            setTimeout(() => {
                toast.remove(id)
            }, duration)  
        }
    }

    function showMany(messages: AppToastMessage[], duration = 3000, useProgress = false) {
        messages.forEach(m => show(m, duration, useProgress))
    }

    function error(text: string) {
        show({text, level: 'error'})
    }

    function warning(text: string) {
        show({text, level: 'warning'})
    }

    function info(text: string) {
        show({text, level: 'info'})
    }

    function success(text: string) {
        show({text, level: 'success'})
    }

    function remove(id: (string | number)) {
        toast.remove(id)
    }

    function clear() {
        toast.clear()
    }

    return {
        show,
        showMany,
        error,
        warning,
        info,
        success,
        remove,
        clear,
    }
}
```

## File: app/layouts/documents/create-layout.vue
```vue
<script setup lang="ts">

</script>

<template>
  <main class="h-screen w-screen overflow-hidden bg-default p-4 sm:p-6">
    <slot/>
  </main>
</template>
```

## File: app/layouts/default.vue
```vue
<script setup lang="ts">

const sidebarCollapsed = ref(false)
const createModalOpen = ref(false)
const createDocumentLabel = 'Новый документ'

</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-default">
    
    <LayoutAppHeader 
        class="shrink-0"
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
    />

    <main class="min-h-0 flex-1 overflow-hidden">

      <UDashboardGroup
          storage="cookie"
          storage-key="main-dashboard-layout"
          class="h-full overflow-hidden"
      >
        
        <UDashboardSidebar
            v-model:collapsed="sidebarCollapsed"
            side="left"
            collapsible
            resizable
            :default-size="18"
            :min-size="14"
            :max-size="28"
            class="border-r border-default"
        >
          
          <LayoutAppSidebarMenu :collapsed="sidebarCollapsed"/>

          <template #footer>
            <div class="flex w-full justify-center px-2">
              <UTooltip v-if="sidebarCollapsed" :text="createDocumentLabel" :content="{ side: 'right' }">
                <UButton
                    icon="i-lucide-file-plus"
                    variant="solid"
                    square
                    class="justify-center"
                    :aria-label="createDocumentLabel"
                    @click="createModalOpen = true"/>
              </UTooltip>

              <UButton
                  v-else
                  class="w-full max-w-48 justify-center"
                  :label="createDocumentLabel"
                  icon="i-lucide-file-plus"
                  variant="solid"
                  @click="createModalOpen = true"/>
            </div>
          </template>
          
        </UDashboardSidebar>

        <div class="flex min-w-0 flex-1">
          <UDashboardPanel class="min-w-0">
            <template #body>
                <slot/>
            </template>
          </UDashboardPanel>
        </div>
        
      </UDashboardGroup>

    </main>
    
  </div>
  
  <ModalCreateDocumentModal v-model:open="createModalOpen"/>
  
</template>

<style scoped>

</style>
```

## File: app/layouts/login-layout.vue
```vue
<script setup lang="ts">

</script>

<template>
  <main class="h-screen w-screen overflow-hidden bg-default">
    <slot/>
  </main>
</template>

<style scoped>

</style>
```

## File: app/middleware/auth.global.ts
```typescript
import {useAuthStore} from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore()

    // Если есть токен, но профиль еще не загружен (например, после F5)
    // Загружаем профиль ДО того, как отрендерится страница (SSR)
    if (authStore.token && !authStore.user) {
        try {
            await authStore.fetchUser()
        }
        catch {
            authStore.logout()
        }
    }

    const publicRoutes = new Set([
        '/login',
    ])

    // Считаем страницу /login публичной
    const isPublicRoute = publicRoutes.has(to.path)

    // Если нет токена и страница не публичная -> на логин
    if (!authStore.isAuthenticated && !isPublicRoute) {
        return navigateTo('/login')
    }

    // Если авторизован и идет на логин -> на главную
    if (authStore.isAuthenticated && isPublicRoute) {
        return navigateTo('/')
    }
})
```

## File: app/pages/documents/control.vue
```vue
<script setup lang="ts">

useHead({
  title: 'Контроль согласования'
})

</script>

<template>
  <DocumentsControlScreen />
</template>

<style scoped>

</style>
```

## File: app/pages/documents/create.vue
```vue
<script setup lang="ts">

definePageMeta({
  layout: 'documents-create-layout'
})

useHead({
  title: 'Новый документ'
})

</script>

<template>
  <DocumentsCreateScreen />
</template>
```

## File: app/pages/documents/private.vue
```vue
<script setup lang="ts">

useHead({
  title: 'Личная страница'
})

</script>

<template>
  <DocumentsPrivateScreen />

</template>

<style scoped>

</style>
```

## File: app/pages/documents/signing.vue
```vue
<script setup lang="ts">

useHead({
  title: 'Согласование документов'
})

</script>

<template>
  <DocumentsSigningScreen />
</template>

<style scoped>

</style>
```

## File: app/pages/index.vue
```vue
<script setup lang="ts">

</script>

<template>
  <div>
    Empty page...
  </div>
</template>

<style scoped>

</style>
```

## File: app/pages/login.vue
```vue
<script setup lang="ts">
// Отключаем стандартный layout, если он у тебя есть (например, с боковой панелью),
// чтобы страница логина была пустой и по центру экрана.
import {useAuthStore} from "~/stores/auth";

definePageMeta({
  layout: 'login-layout'
})

const authStore = useAuthStore()
const toast = useToast()

// Реактивное состояние формы
const state = reactive({
  login: '',
  password: ''
})

async function onSubmit() {

  // Базовая валидация на пустоту
  if (!state.login || !state.password) {
    toast.add({
      title: 'Внимание',
      description: 'Пожалуйста, введите логин и пароль',
      color: "warning"
    })
    return
  }

  try {
    await authStore.login({
      login: state.login,
      password: state.password
    })

    // Перенаправляем на главную страницу после успешного входа
    navigateTo('/')
  } catch (error: any) {
    console.error('Ошибка входа:', error)

    // Выводим красивое уведомление об ошибке через Nuxt UI
    toast.add({
      title: 'Ошибка авторизации',
      description: error?.data?.message || 'Неверный логин или пароль. Проверьте введенные данные.',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Вход в систему
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Введите данные для доступа к документам
          </p>
        </div>
      </template>

      <form @submit.prevent="onSubmit" class="space-y-4">

        <UFormField label="Логин" name="login">
          <UInput
              class="w-full max-w-sm"
              v-model="state.login"
              placeholder="Логин или Email"
              icon="lucide-user"
              autocomplete="username"
              :disabled="authStore.loading"
          />
        </UFormField>

        <UFormField label="Пароль" name="password">
          <UInput
              class="w-full max-w-sm"
              v-model="state.password"
              type="password"
              placeholder="••••••••"
              icon="lucide-key"
              autocomplete="current-password"
              :disabled="authStore.loading"
          />
        </UFormField>

        <div class="pt-2">
          <UButton
              type="submit"
              color="primary"
              variant="solid"
              block
              :loading="authStore.loading"
          >
            Войти
          </UButton>
        </div>

      </form>
    </UCard>
  </div>
</template>
```

## File: app/stores/auth.ts
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { navigateTo, useCookie } from '#app'

import { AuthApi } from '~/api/auth.api'
import { useDictionariesStore } from './dictionaries.store'

import type {
    CurrentUser,
    LoginRequest,
} from '#shared/types'

export const useAuthStore = defineStore('auth', () => {

    const tokenCookie = useCookie<string | null>('auth_token')

    const user = ref<CurrentUser | null>(null)

    const token = ref<string | null>(
        tokenCookie.value ?? null,
    )

    async function login(
        credentials: LoginRequest,
    ) {

        const response = await AuthApi.login(credentials)

        token.value = response.Token
        tokenCookie.value = response.Token

        await fetchUser()

    }

    async function fetchUser() {

        if (!token.value)
            return

        try {

            user.value = await AuthApi.getMe(
                token.value,
            )

            const dictionaries =
                useDictionariesStore()

            await dictionaries.fetchDictionaries()

        }
        catch {

            logout()

        }

    }

    function logout() {

        user.value = null

        token.value = null

        tokenCookie.value = null

        useDictionariesStore()
            .clearDictionaries()

        navigateTo('/login')

    }

    return {

        user,

        token,

        login,

        fetchUser,

        logout,

    }

})
```

## File: app/stores/dictionaries.store.ts
```typescript
import { defineStore } from 'pinia'

import { DictionariesApi } from '~/api/dictionaries.api'
import { useApiError } from '~/composables/api/useApiError'

import type { DictionariesResponse } from '#shared/types'

export const useDictionariesStore = defineStore('dictionaries', {
    state: () => ({
        data: null as DictionariesResponse | null,
        isLoading: false,
        error: null as string | null,
    }),

    getters: {
        isLoaded: (state) => state.data !== null,

        departments: (state) => state.data?.Departments ?? [],
        persons: (state) => state.data?.Persons ?? [],
        documentFileTypes: (state) => state.data?.DocumentFileTypes ?? [],
        documentStatusTypes: (state) => state.data?.DocumentStatusTypes ?? [],
        documentOriginTypes: (state) => state.data?.DocumentOriginTypes ?? [],
        personDecisionTypes: (state) => state.data?.PersonDecisionTypes ?? [],
        personRightTypes: (state) => state.data?.PersonRightTypes ?? [],
        personRoleTypes: (state) => state.data?.PersonRoleTypes ?? [],
    },

    actions: {
        async fetchDictionaries(force = false) {

            if (this.isLoaded && !force)
                return

            const apiError = useApiError()

            this.isLoading = true
            this.error = null

            try {

                this.data = await DictionariesApi.getAll()

            }
            catch (error) {

                this.error = apiError.getMessage(error)

            }
            finally {

                this.isLoading = false

            }

        },

        clearDictionaries() {

            this.data = null
            this.error = null
            this.isLoading = false

        },

    },

})
```

## File: app/types/documents/create/form-model.ts
```typescript
import type { DateValue } from '@internationalized/date'

export interface DocumentFormSigner {
    signerId: number
    roleId: number
}

export interface DocumentFormFile {
    fileEntryId: string //Guid
    typeId: number
}

export interface DocumentFormModel {
    name?: string
    date?: DateValue
    description?: string
    statusId?: number
    originId?: number
    executorId?: number
    signerIds?: DocumentFormSigner[]
    files?: DocumentFormFile[] 
}
```

## File: app/types/documents/private/card-item-model.ts
```typescript
import type {DocumentStatusColor} from "~/utils/color";

export interface DocumentCardItem {
    id: string
    name: string
    dateText: string
    description?: string
    statusText?: string
    statusColor: DocumentStatusColor
    originText?: string
    executorText?: string
}
```

## File: app/types/documents/private/chart-item-model.ts
```typescript
import type {DocumentStatusColor} from "~/utils/color";

export interface DocumentChartItem {
    statusId: number
    label: string
    count: number
    color: DocumentStatusColor
}
```

## File: app/types/models/document-origin-type-model.ts
```typescript
export interface DocumentOriginTypeModel {
    id: number
    text?: string
}
```

## File: app/types/models/person-model.ts
```typescript
export interface PersonModel {
    id: number
    isChecked: boolean
    text: string
    roleId?: number
}
```

## File: app/types/models/person-role-model.ts
```typescript
export interface PersonRoleModel {
    id: number
    text: string
}
```

## File: app/utils/color.ts
```typescript
import colors from 'tailwindcss/colors'

export function randomizeDefaultColor() {
    const colors = ['primary', 'secondary', 'warning', 'error']
    return colors[Math.floor(Math.random() * colors.length)]
}

export function getCssColor(varName: string, element: HTMLElement = document.documentElement) {
    return getComputedStyle(element)
        .getPropertyValue(varName)
        .trim()
}

function withOpacity(color: string, opacity: number) {
    if (color.startsWith('oklch(')) {
        return color.replace(')', ` / ${opacity})`)
    }
    return color
}


export type DocumentStatusColor = {
    bgClass: string
    textClass: string
    borderClass: string
    chartColor: string
}

const documentStatusColors: Record<number, DocumentStatusColor> = {
    1: {
        bgClass: 'bg-blue-500/90',
        textClass: 'text-inverted',
        borderClass: 'border-blue-500/90',
        chartColor: withOpacity(colors.blue[500], 0.9)
    },//created
    2: {
        bgClass: 'bg-yellow-500',
        textClass: 'text-inverted',
        borderClass: 'border-yellow-500/90',
        chartColor: withOpacity(colors.yellow[500], 0.9)
    },//submitted
    3: {
        bgClass: 'bg-green-500/90',
        textClass: 'text-inverted',
        borderClass: 'border-green-500/90',
        chartColor: withOpacity(colors.green[500], 0.9)
    },//reviewed
    4: {
        bgClass: 'bg-red-500/90',
        textClass: 'text-inverted',
        borderClass: 'border-red-500/90',
        chartColor: withOpacity(colors.red[500], 0.9)
    },//refused
    5: {
        bgClass: 'bg-emerald-500/90',
        textClass: 'text-inverted',
        borderClass: 'border-emerald-500/90',
        chartColor: withOpacity(colors.emerald[500], 0.9)
    },//signed
    6: {
        bgClass: 'bg-amber-600',
        textClass: 'text-inverted',
        borderClass: 'border-amber-600/90',
        chartColor: withOpacity(colors.amber[600], 0.9)
    },//submittedToDirector
    7: {
        bgClass: 'bg-green-800/90',
        textClass: 'text-inverted',
        borderClass: 'border-green-800/90',
        chartColor: withOpacity(colors.green[800], 0.9)
    },//reviewedByDirector
    8: {
        bgClass: 'bg-red-800',
        textClass: 'text-inverted',
        borderClass: 'border-red-800/90',
        chartColor: withOpacity(colors.red[800], 0.9)
    },//refusedByDirector
    9: {
        bgClass: 'bg-emerald-800',
        textClass: 'text-inverted',
        borderClass: 'border-emerald-800/90',
        chartColor: withOpacity(colors.emerald[800], 0.9)
    },//signedByDirector
    0: {
        bgClass: 'bg-gray-400/90',
        textClass: 'text-inverted',
        borderClass: 'border-gray-400/90',
        chartColor: withOpacity(colors.gray[400], 0.9)
    },//default
}

export function getDocumentStatusColor(statusId?: number | null) {
    if (!statusId) {
        return documentStatusColors[0]!
    }

    return (documentStatusColors[statusId] ?? documentStatusColors[0])!
}
```

## File: app/utils/date.ts
```typescript
import {CalendarDate, type DateValue, parseDate, getLocalTimeZone, today} from '@internationalized/date'

export const MinimalDate: DateValue = new CalendarDate(2000, 1, 1);
export const MaximalDate: DateValue = getTodayDateValue();

export type DateRange = {
    start: DateValue
    end: DateValue
} | undefined

export const Periods = [
    {label: 'День', value: 'day'},
    {label: 'Неделя', value: 'week'},
    {label: 'Месяц', value: 'month'},
    {label: 'Всё время', value: 'allTime'},
] as const

export type PeriodValue = typeof Periods[number]['value']

export function formatDate(value: string | Date | null | undefined): string {
    if (!value) return ''

    const date = typeof value === 'string' ? new Date(value) : value

    if (isNaN(date.getDate())) return ''

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
}

export function formatCalendarDate(value: DateValue | null | undefined): string {
    if (!value) return ''

    const day = String(value.day).padStart(2, '0')
    const month = String(value.month).padStart(2, '0')
    const year = value.year

    return `${day}.${month}.${year}`
}

export function formatDateToISO(value: DateValue | null | undefined): string | undefined {
    if (!value) return undefined

    const day = String(value.day).padStart(2, '0')
    const month = String(value.month).padStart(2, '0')
    const year = value.year

    return `${year}-${month}-${day}`
}

export function getTodayDateValue(): DateValue {
    return new CalendarDate(
        today(getLocalTimeZone()).year,
        today(getLocalTimeZone()).month,
        today(getLocalTimeZone()).day);
}
```

## File: app/utils/document-filters.utils.ts
```typescript
export function hasActiveFilters(
    filters?: Record<string, unknown> | null,
): boolean {

    if (!filters)
        return false

    return Object.values(filters).some((value) => {

        if (Array.isArray(value))
            return value.length > 0

        return value !== null &&
            value !== undefined &&
            value !== ''

    })

}
```

## File: app/utils/error.utils.ts
```typescript
export function getErrorMessage(
    error: unknown,
    fallback = 'Произошла неизвестная ошибка',
): string {

    if (error instanceof Error)
        return error.message

    if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
    ) {

        const message = (error as { message?: unknown }).message

        if (typeof message === 'string')
            return message

    }

    return fallback

}
```

## File: app/utils/file.ts
```typescript
export type FileKind =
    | 'image'
    | 'pdf'
    | 'word'
    | 'excel'
    | 'presentation'
    | 'text'
    | 'archive'
    | 'video'
    | 'audio'
    | 'unknown'

export type FileInfoSource =
    | File
    | string
    | {
    name?: string | null
    fileName?: string | null
    originalName?: string | null
    type?: string | null
    mimeType?: string | null
    contentType?: string | null
}

export const fileIconMap = {
    image: 'i-lucide-image',
    pdf: 'i-lucide-file-text',
    word: 'i-lucide-file-type',
    excel: 'i-lucide-sheet',
    presentation: 'i-lucide-presentation',
    text: 'i-lucide-file-code-2',
    archive: 'i-lucide-file-archive',
    video: 'i-lucide-file-video',
    audio: 'i-lucide-file-audio',
    unknown: 'i-lucide-file',
} as const

export const fileColorMap = {
    image: 'success',
    pdf: 'error',
    word: 'primary',
    excel: 'success',
    presentation: 'warning',
    text: 'neutral',
    archive: 'warning',
    video: 'primary',
    audio: 'secondary',
    unknown: 'neutral',
} as const

export function getExtension(name?: string | null) {
    if (!name) return ''

    const parts = name.split('.')

    if (parts.length <= 1) return ''
    if (parts.length === 2 && name.startsWith('.')) return ''

    return parts.pop()!.toLowerCase()
}

function getSourceName(file: FileInfoSource) {
    if (typeof file === 'string') return file

    if (file instanceof File) return file.name

    return (
        file.originalName ||
        file.fileName ||
        file.name ||
        ''
    )
}

function getSourceMimeType(file: FileInfoSource) {
    if (typeof file === 'string') return ''

    if (file instanceof File) return file.type

    return (
        file.mimeType ||
        file.contentType ||
        file.type ||
        ''
    )
}

export function getFileKindByMimeAndExtension(
    mimeType?: string | null,
    extension?: string | null,
): FileKind {
    const type = (mimeType ?? '').toLowerCase()
    const ext = (extension ?? '').toLowerCase()

    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'audio'

    if (type === 'application/pdf') return 'pdf'

    if (
        type.includes('word') ||
        type.includes('msword') ||
        type.includes('officedocument.wordprocessingml')
    ) {
        return 'word'
    }

    if (
        type.includes('excel') ||
        type.includes('spreadsheet') ||
        type.includes('officedocument.spreadsheetml')
    ) {
        return 'excel'
    }

    if (
        type.includes('powerpoint') ||
        type.includes('presentation') ||
        type.includes('officedocument.presentationml')
    ) {
        return 'presentation'
    }

    if (type.startsWith('text/')) return 'text'

    switch (ext) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'webp':
        case 'bmp':
            return 'image'

        case 'pdf':
            return 'pdf'

        case 'doc':
        case 'docx':
        case 'rtf':
            return 'word'

        case 'xls':
        case 'xlsx':
        case 'csv':
            return 'excel'

        case 'ppt':
        case 'pptx':
            return 'presentation'

        case 'txt':
        case 'json':
        case 'xml':
        case 'md':
            return 'text'

        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return 'archive'

        case 'mp4':
        case 'avi':
        case 'mov':
        case 'webm':
            return 'video'

        case 'mp3':
        case 'wav':
        case 'ogg':
            return 'audio'
    }

    return 'unknown'
}

export function canPreviewFileKind(kind: FileKind) {
    return kind === 'pdf' || kind === 'image'
}

export function getFileInfo(file: FileInfoSource) {
    const name = getSourceName(file)
    const mimeType = getSourceMimeType(file)
    const ext = getExtension(name)
    const kind = getFileKindByMimeAndExtension(mimeType, ext)

    return {
        name,
        ext,
        mimeType,
        kind,
        icon: fileIconMap[kind],
        color: fileColorMap[kind],
        canPreview: canPreviewFileKind(kind),
    }
}
```

## File: app/utils/sort.ts
```typescript
//export type SortOrder = 'asc' | 'desc' | null
export const SortOrders = [
    {direction: 'asc', icon: 'i-lucide-arrow-up', tooltip: 'Сортировка: сначала старые'},
    {direction: 'desc', icon: 'i-lucide-arrow-down', tooltip: 'Сортировка: сначала новые'},
    {direction: null, icon: 'i-lucide-arrow-down-up', tooltip: 'Без сортировки'},
] as const

export type SortDirection = typeof SortOrders[number]['direction']

export function GetSortOrderByDirection(direction: SortDirection) {
    return SortOrders.find(x => x.direction === direction)!
}
```

## File: app/app.config.ts
```typescript
export default defineAppConfig({
    ui: {        
        dashboardGroup: {
            base: 'static inset-auto flex min-h-0 h-full w-full overflow-hidden'
        },

        dashboardSidebar: {
            slots: {
                root: 'relative hidden lg:flex flex-col min-h-0 min-w-16 w-(--width) shrink-0'
            }
        },

        dashboardPanel: {
            slots: {
                root: 'relative flex flex-col min-w-0 min-h-0 lg:not-last:border-e lg:not-last:border-default shrink-0',
                body: 'flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto p-4 sm:p-6'
            }
        },
    }
})
```

## File: app/app.vue
```vue
<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import {shallowReadonly} from "vue";

useHead({
  titleTemplate: (titleChunk) =>
      titleChunk ? `${titleChunk} · Clerical Work Signing` : 'Clerical Work Signing',
})

</script>

<template>
  <NuxtLoadingIndicator/>
  <UApp :locale="locales.ru" :toaster="{ position: 'top-right' }">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </UApp>
</template>

<style scoped>

</style>
```
