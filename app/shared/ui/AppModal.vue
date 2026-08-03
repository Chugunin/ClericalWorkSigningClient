<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-my-1" @click="isOpen = false" />
        </div>
      </template>

      <slot />

    </UCard>
  </UModal>
</template>

<script setup lang="ts">

defineProps<{
  title: string
}>()

const isOpen = defineModel<boolean>()

</script>