<script setup lang="ts">
import {useClipboard} from '@vueuse/core';

const value = defineModel<string>();
const {copy, copied} = useClipboard();

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
            @click="copy(value)"/>
      </UTooltip>
    </template>
  </UInput>
</template>

<style scoped>

</style>