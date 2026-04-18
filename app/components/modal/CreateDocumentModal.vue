<script setup lang="ts">
import DocumentsCreatePage from '~/pages/documents/create.vue'

const open = defineModel<boolean>('open', {required: true})

function closeModal() {
  open.value = false
}

function openInNewTab() {
  window.open('/documents/create', '_blank', 'noopener,noreferrer')
}

</script>

<template>

  <UModal
      v-model:open="open"
      :dismissible="false"
      :overlay="true"
      :close="false"
      :ui="{
        content: 'flex h-[90vh] w-[90vw] max-w-none flex-col overflow-hidden',
        body: 'min-h-0 flex-1 overflow-hidden',
        footer: 'justify-end'
      }"
  >
    <template #content>
      
      <div class="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl bg-default">
        
        <div class="flex shrink-0 items-center justify-between border-b border-default px-4 py-3">
          
          <div>
            <h2 class="text-lg font-semibold">Создание нового документа</h2>
          </div>

          <div class="flex items-center gap-2">
            <UButton
                icon="i-lucide-external-link"
                label="Открыть в новой вкладке"
                color="neutral"
                variant="soft"
                @click="openInNewTab"
            />

            <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                square
                @click="closeModal"
            />
          </div>
        </div>

        <div class="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
          <DocumentsCreatePage v-if="open" @closeContainer="closeModal"/>
        </div>
        
      </div>
      
    </template>
  </UModal>

</template>

<style scoped>

</style>
