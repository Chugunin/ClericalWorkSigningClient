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