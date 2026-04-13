<script setup lang="ts">

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

</script>

<template>
  <div class="flex items-center justify-end gap-3">
    <UButton color="neutral" variant="soft" @click="emit('cancel')" class="hidden">
      Отмена
    </UButton>

    <UButton type="submit" @click="emit('submit')">
      Создать документ
    </UButton>
  </div>
</template>

<style scoped>

</style>