<script setup lang="ts">
import {useClipboard} from '@vueuse/core';

withDefaults(defineProps<{
  placeholderText?: string
  resetVisible?: boolean
  copyVisible?: boolean
}>(), {
  placeholderText: 'Введите текст',
  resetVisible: true,
  copyVisible: false,
});

const value = defineModel<string>();
const {copy, copied} = useClipboard();

</script>

<template>
  <UInput
      v-model="value"
      :placeholder="placeholderText"
      :ui="{ trailing: 'pe-1' }"
  >

    <template v-if="value?.length" #trailing>

      <UTooltip text="Очистить поле" :content="{ side: 'bottom' }">
        <UButton
            color="neutral"
            variant="link"
            size="sm"
            icon="i-lucide-x"
            aria-label="Очистить поле"
            :class="resetVisible ? '' : 'hidden'"
            @click="value = ''"/>
      </UTooltip>

      <UTooltip text="Скопировать текст" :content="{ side: 'bottom' }">
        <UButton
            :color="copied ? 'success' : 'neutral'"
            variant="link"
            size="sm"
            :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
            aria-label="Скопировать текст"
            :class="copyVisible ? '' : 'hidden'"
            @click="copy(value)"/>
      </UTooltip>

    </template>

  </UInput>
</template>