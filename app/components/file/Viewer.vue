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