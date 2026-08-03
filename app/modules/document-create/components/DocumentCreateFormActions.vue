<script setup lang="ts">

defineProps<{ submitting?: boolean }>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

</script>

<template>
  <div class="flex items-center justify-end p-2 gap-3">
    <UButton color="neutral" variant="soft" class="hidden" @click="emit('cancel')">
      Отмена
    </UButton>

    <UButton :loading="submitting" :disabled="submitting" @click="emit('submit')">
      Создать документ
    </UButton>
  </div>
</template>

<style scoped>

</style>