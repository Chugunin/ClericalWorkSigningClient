<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {DocumentFileType} from "#shared/types/contracts/responses/dictionaries/document-file-type";

const model = defineModel<DocumentFormModel>({required: true})

const props = defineProps<{
  fileTypes: DocumentFileType[]
}>()

const files = ref<File[]>([])
const previewMap = ref<Record<string, string>>({})

function fileKey(file: File) {
  return `${file.name}_${file.size}_${file.lastModified}`
}

watch(files, (newFiles, oldFiles = []) => {
  const next: Record<string, string> = {}

  for (const file of newFiles) {
    const key = fileKey(file)

    if (previewMap.value[key]) {
      next[key] = previewMap.value[key]
      continue
    }

    if (file.type.startsWith('image/')) {
      next[key] = URL.createObjectURL(file)
    }
  }

  for (const [key, url] of Object.entries(previewMap.value)) {
    if (!next[key]) {
      URL.revokeObjectURL(url)
    }
  }

  previewMap.value = next
}, {deep: true})

onBeforeUnmount(() => {
  for (const url of Object.values(previewMap.value)) {
    URL.revokeObjectURL(url)
  }
})

function getPreviewUrl(file: File) {
  return previewMap.value[fileKey(file)]
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

function clearAll() {
  files.value = []
}

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

      <!--            <UFileUpload
                      v-model="files"
                      multiple
                      :interactive="false"
                      :highlight="false"
                      label="Перетащи сюда файлы"
                      description="или нажми кнопку ниже"
                      class="h-full min-h-0 m-0.5"
                      :ui="{
                        base: 'overflow-auto',
                        files: 'mt-4'
                      }"
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
                      <div v-if="files?.length" class="mt-2 mb-2 flex items-center justify-between">
                        
                        <p class="font-bold">Всего: ({{ files?.length }})</p>
      
                        <div class="flex items-center gap-1">
      
                          <UTooltip text="Добавить файл">
                            <UButton
                                icon="i-lucide-plus"
                                color="neutral"
                                variant="outline"
                                class="-my-2"
                                @click="open()"
                            />
                          </UTooltip>
      
                          <UTooltip text="Удалить все">
                            <UButton
                                icon="i-lucide-trash"
                                color="neutral"
                                variant="outline"
                                class="-my-2"
                                @click="clearAll"
                            />
                          </UTooltip>
                        </div>
      
                      </div>
                    </template>
      
                    <template #files="{ files: slotFiles }">
                      <div v-if="slotFiles?.length" class="space-y-2">
      
                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          <div
                              v-for="(file, index) in slotFiles"
                              :key="getFileKey(file)"
                              class="rounded-lg border border-default bg-default p-3"
                          >
                            <div class="flex items-start justify-between gap-3">
                              <div class="min-w-0">
                                <div class="truncate font-medium">
                                  {{ file.name }}
                                </div>
      
                                <div class="mt-1 text-sm text-muted">
                                  {{ formatSize(file.size) }}
                                </div>
      
                                <div
                                    v-if="meta[getFileKey(file)]?.status"
                                    class="mt-2 text-xs text-muted"
                                >
                                  Статус: {{ meta[getFileKey(file)]?.status }}
                                </div>
                              </div>
      
                              <UButton
                                  icon="i-lucide-x"
                                  color="error"
                                  variant="ghost"
                                  size="sm"
                                  @click="removeAt(index)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </UFileUpload>-->

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
            <span class="text-md font-bold">Добавлено: ({{ files?.length }})</span>

            <div class="flex items-center gap-1">

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
          <UTooltip
              :text="file.name"
              :disabled="file.name.length < 20"
              :ui="{
                content: 'max-w-xs break-words'
              }"
          >
            <div class="relative text-xs gap-1.5 p-0 aspect-square">
              <span
                  class="inline-flex items-center justify-center select-none align-middle bg-elevated text-base shrink-0 size-full rounded-lg">
                
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

              <div class="absolute inset-0 flex items-end p-2 pointer-events-none">
                <div class="w-full rounded bg-inverted/75 text-inverted text-xs px-2 py-1 truncate">
                  {{ file.name }}
                </div>
              </div>

              <UButton
                  variant="solid"
                  size="xl"
                  class="absolute -top-1.5 -inset-s-1.5 z-10 p-0 gap-1 
                    bg-accented/75 text-default/75 hover:bg-inverted hover:text-inverted active:bg-accented/85 active:text-default/75 
                    border-2 border-default rounded-full"
                  @click.stop="removeFile(index)"
              >
                <UIcon name="i-lucide-x"/>
              </UButton>

            </div>
          </UTooltip>
        </template>

      </UFileUpload>

    </UCard>
  </div>
</template>

<style scoped>

</style>
