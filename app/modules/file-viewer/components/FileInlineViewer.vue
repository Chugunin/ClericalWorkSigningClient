<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { loadPhysicalFile } from '../composables/usePhysicalFile'
import type { ObjectUrlResource } from '../model/object-url-resource'

const props = defineProps<{
  fileId: string
  fileName?: string
}>()

const loading = ref(false)
const error = ref<string | null>(null)
const resource = ref<ObjectUrlResource | null>(null)
let requestController: AbortController | null = null

const fileUrl = computed(() => resource.value?.url ?? null)
const mimeType = computed(() => resource.value?.mimeType ?? 'application/octet-stream')
const isPdf = computed(() => mimeType.value === 'application/pdf')
const isImage = computed(() => mimeType.value.startsWith('image/'))

function releaseCurrentResource() {
  resource.value?.release()
  resource.value = null
}

async function loadFile(fileId: string) {
  requestController?.abort()
  requestController = new AbortController()
  releaseCurrentResource()
  loading.value = true
  error.value = null

  try {
    resource.value = await loadPhysicalFile(fileId, requestController.signal)
  }
  catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') return
    error.value = 'Не удалось загрузить файл'
  }
  finally {
    loading.value = false
  }
}

watch(() => props.fileId, loadFile, { immediate: true })

onBeforeUnmount(() => {
  requestController?.abort()
  releaseCurrentResource()
})
</script>

<template>
  <div class="h-full min-h-0 overflow-hidden rounded-lg border border-default">
    <div v-if="loading" class="flex h-full items-center justify-center">
      <UIcon name="i-lucide-loader-2" class="size-6 animate-spin" />
    </div>

    <div v-else-if="error" class="flex h-full items-center justify-center text-error">
      {{ error }}
    </div>

    <iframe v-else-if="fileUrl && isPdf" :src="fileUrl" class="h-full w-full" />

    <img
      v-else-if="fileUrl && isImage"
      :src="fileUrl"
      :alt="fileName"
      class="mx-auto max-h-full max-w-full object-contain"
    >

    <div v-else class="flex h-full flex-col items-center justify-center gap-2 text-muted">
      <UIcon name="i-lucide-file" class="size-10" />
      <div>{{ fileName ?? 'Файл' }}</div>
      <div class="text-sm">Предпросмотр недоступен</div>
    </div>
  </div>
</template>
