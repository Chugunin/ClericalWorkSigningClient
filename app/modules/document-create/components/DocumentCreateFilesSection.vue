<script setup lang="ts">

/*import type {DocumentFormModel} from "../model/document-create-form.model";
import type {DocumentFileType} from "#shared/contracts/dictionaries/dictionary-item.contract";*/
import { getFileInfo, saveFileEntry } from '~/modules/file-viewer'
import { useDocumentCreateFiles } from '../composables/useDocumentCreateFiles'

/*const model = defineModel<DocumentFormModel>({required: true})

const props = defineProps<{
  fileTypes: DocumentFileType[]
}>()*/

const attachments = ref<File[]>([])

const {
  mainFileKey,

  isMainFile,
  getPreviewUrl,

  markMainFile,
  removeFile,
  clearAll,
  saveAll,

} = useDocumentCreateFiles(attachments, {
  saveFile: saveFileEntry,
})

defineExpose({
  saveAll,
  mainFileKey,
})

const fileUploadUi = computed(() => ({
  base: [
    'p-2 border-hidden focus:outline-none focus:ring-0 focus-visible:ring-0',
    attachments.value.length ? 'justify-start' : 'justify-center items-center'
  ].join(' '),
  root: attachments.value.length
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
          v-model="attachments"
          layout="grid"
          multiple
          :interactive="false"
          :highlight="false"
          label="Перетащите сюда файлы"
          class="h-full min-h-0 overflow-auto"
          :ui="fileUploadUi"
      >

        <template #actions="{ open }">

          <div v-if="!attachments?.length" class="flex flex-wrap gap-2">
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
                >
  
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
