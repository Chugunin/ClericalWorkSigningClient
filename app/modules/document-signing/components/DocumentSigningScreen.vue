<script setup lang="ts">
import { AppThreePaneShell } from '~/shared/layout'

import DocumentSigningListSection from './DocumentSigningListSection.vue'
import DocumentSigningMainSection from './DocumentSigningMainSection.vue'
import { provideDocumentSigningSelection } from '../composables/useDocumentSigningSelection'

const defaultPanelSizes = [25, 75, 0]

provideDocumentSigningSelection()

</script>

<template>
  <div class="flex min-h-0 w-full h-full flex-col gap-4 overflow-hidden">
    <AppThreePaneShell
        class="min-h-0 flex-1 overflow-hidden"
        layout-state-key="documents-signing-screen"
        :default-sizes=defaultPanelSizes
        :min-sizes="[20, 50, 0]"
        :max-sizes="[50, 100, 0]"
        :is-left-panel-collapsible="true"
        :is-left-panel-resizable="true"
        :is-center-panel-collapsible="false"
        :is-right-panel-enabled="false"
    >

      <template #left-panel>
        <DocumentSigningListSection />
      </template>

      <template #center-panel>
        <DocumentSigningMainSection />
      </template>

    </AppThreePaneShell>
  </div>
</template>

<style scoped>

</style>
