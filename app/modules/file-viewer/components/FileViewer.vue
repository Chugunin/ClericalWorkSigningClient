<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { loadPhysicalFile } from '../composables/usePhysicalFile'
import type { ObjectUrlResource } from '../model/object-url-resource'

const props = withDefaults(defineProps<{
  fileId: string
  fileName?: string
  buttonLabel?: string
}>(), {
  buttonLabel: 'Открыть',
  fileName: '',
})

const toast = useToast()
const loading = ref(false)
const resources = new Set<ObjectUrlResource>()
let requestController: AbortController | null = null

async function openFile() {
  requestController?.abort()
  requestController = new AbortController()
  loading.value = true

  try {
    const resource = await loadPhysicalFile(props.fileId, requestController.signal)
    resources.add(resource)

    const openedWindow = window.open(resource.url, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      throw new Error('Browser blocked the file preview window')
    }
  }
  catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') return

    toast.add({
      title: 'Ошибка открытия файла',
      description: props.fileName
        ? `Не удалось открыть файл "${props.fileName}"`
        : 'Не удалось открыть файл',
      color: 'error',
    })
  }
  finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  requestController?.abort()
  resources.forEach(resource => resource.release())
  resources.clear()
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
