<script setup lang="ts">

defineProps<{
  sidebarCollapsed: boolean
}>()

const emit = defineEmits<{
  toggleSidebar: []
}>()

</script>

<template>
  <UDashboardNavbar>

    <template #leading>
      <UDashboardSidebarCollapse
          :icon="sidebarCollapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
          color="neutral"
          variant="ghost"
          @click="emit('toggleSidebar')"
      />
    </template>
    
    <template #title>
      СПО Согласование документов
    </template>

    <template #right>
      <UColorModeButton/>
      <UButton
          label="Выход"
          trailing-icon="i-lucide-square-arrow-right-exit"
          variant="solid"
          color="error"
          @click=""/>
    </template>

  </UDashboardNavbar>
</template>

<style scoped>

</style>