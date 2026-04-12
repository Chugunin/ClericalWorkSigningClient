<script setup lang="ts">
const value = defineModel<string>();
const copied = ref(false);

async function copyValue() {
  if (!value.value) {
    return
  }

  await navigator.clipboard.writeText(value.value)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1500)
}

</script>

<template>
  <UInput
      v-model="value"
      :ui="{ trailing: 'pe-1' }">
    <template v-if="value?.length" #trailing>
      <UTooltip text="Clear" :content="{ side: 'bottom' }">
        <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-circle-x"
            aria-label="Clear input"
            @click="value = ''"/>
      </UTooltip>
      <UTooltip text="Copy to clipboard" :content="{ side: 'bottom' }">
        <UButton
            :color="copied ? 'success' : 'neutral'"
            variant="link"
            size="sm"
            :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            aria-label="Copy to clipboard"
            @click="copyValue"/>
      </UTooltip>
    </template>
  </UInput>
</template>

<style scoped>

</style>
