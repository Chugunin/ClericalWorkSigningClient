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