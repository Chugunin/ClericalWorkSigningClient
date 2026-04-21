<script setup lang="ts">

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

</script>

<template>
  <div class="flex items-center justify-end p-2 gap-3">
    <UButton color="neutral" variant="soft" @click="emit('cancel')" class="hidden">
      Отмена
    </UButton>

    <UButton @click="emit('submit')">
      Создать документ
    </UButton>
  </div>
</template>

<style scoped>

</style>