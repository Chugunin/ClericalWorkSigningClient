<script setup lang="ts">
import { useApplicationBootstrap } from '~/app/bootstrap'
import { DocumentCreateModal } from '~/modules/document-create'
import { AppHeader, AppSidebarMenu } from '~/shared/layout'

const sidebarCollapsed = ref(false)
const createModalOpen = ref(false)
const createDocumentLabel = 'Новый документ'
const bootstrap = useApplicationBootstrap()

</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-default">
    
    <AppHeader 
        class="shrink-0"
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
        @logout="bootstrap.logout()"
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
          
          <AppSidebarMenu :collapsed="sidebarCollapsed"/>

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

    <DocumentCreateModal v-model:open="createModalOpen"/>
    
  </div>
  
</template>

<style scoped>

</style>
