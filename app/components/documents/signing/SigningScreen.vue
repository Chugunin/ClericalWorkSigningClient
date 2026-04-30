<script setup lang="ts">

const defaultPanelSizes = [25, 75, 0]

</script>

<template>
  <div class="flex min-h-0 w-full h-full flex-col gap-4 overflow-hidden">
    <LayoutAppThreePaneShell
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
        <DocumentsSigningListSection/>
      </template>

      <template #center-panel>
        <DocumentsSigningMainSection/>
      </template>

    </LayoutAppThreePaneShell>
  </div>
</template>

<style scoped>

</style>