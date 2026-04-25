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