<script setup lang="ts">

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
        content: 'w-[70vw] max-w-none h-[70vh]',
        body: 'flex-1 min-h-0 overflow-auto',
        footer: 'justify-end'
      }"
  >
    <template #content>
      
      <div class="flex h-[70vh] flex-col overflow-hidden rounded-xl bg-default">
        
        <div class="flex items-center justify-between border-b border-default px-4 py-3">
          <div>
            <h2 class="text-lg font-semibold">Новый документ</h2>
            <p class="text-sm text-muted">Создание документа в модальном окне</p>
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

        <div class="min-h-0 flex-1 overflow-auto p-4">
          <DocumentsCreatePageContent/>
        </div>
        
      </div>
      
    </template>
  </UModal>

</template>

<style scoped>

</style>