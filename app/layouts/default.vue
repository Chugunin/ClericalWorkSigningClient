<script setup lang="ts">

const sidebarCollapsed = ref(false)
const createModalOpen = ref(false)
const createDocumentLabel = 'Новый документ'

</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-default">
    
    <LayoutAppHeader 
        class="shrink-0"
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
    />

    <main class="min-h-0 flex-1 overflow-hidden">

      <UDashboardGroup
          storage="cookie"
          storage-key="main-dashboard-layout"
          class="h-full overflow-hidden"
      >
        
        <UDashboardSidebar
            v-model:collapsed="sidebarCollapsed"
            side="left"
            collapsible
            resizable
            :default-size="18"
            :min-size="14"
            :max-size="28"
            class="border-r border-default"
        >
          
          <LayoutAppSidebarMenu :collapsed="sidebarCollapsed"/>

          <template #footer>
            <div class="flex w-full justify-center px-2">
              <UTooltip v-if="sidebarCollapsed" :text="createDocumentLabel" :content="{ side: 'right' }">
                <UButton
                    icon="i-lucide-file-plus"
                    variant="solid"
                    square
                    class="justify-center"
                    :aria-label="createDocumentLabel"
                    @click="createModalOpen = true"/>
              </UTooltip>

              <UButton
                  v-else
                  class="w-full max-w-48 justify-center"
                  :label="createDocumentLabel"
                  icon="i-lucide-file-plus"
                  variant="solid"
                  @click="createModalOpen = true"/>
            </div>
          </template>
          
        </UDashboardSidebar>

        <div class="flex min-w-0 flex-1">
          <UDashboardPanel class="min-w-0">
            <template #body>
                <slot/>
            </template>
          </UDashboardPanel>
        </div>
        
      </UDashboardGroup>

    </main>
    
  </div>
  
  <ModalCreateDocumentModal v-model:open="createModalOpen"/>
  
</template>

<style scoped>

</style>