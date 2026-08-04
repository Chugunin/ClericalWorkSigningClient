<script setup lang="ts">
import { ref } from 'vue'

import DocumentSignatureVerification from './DocumentSignatureVerification.vue'
import DocumentSigningWorkspace from './DocumentSigningWorkspace.vue'
import DocumentSigningCertificate from './DocumentSigningCertificate.vue'

type SigningWorkspaceTab = 'sign' | 'verify' | 'certificate'

const activeTab = ref<SigningWorkspaceTab>('sign')
</script>

<template>
  <div class="flex min-h-0 w-full flex-1 flex-col">
    <UCard
      class="min-h-0 w-full flex-1"
      :ui="{
        root: 'flex h-full min-h-0 flex-col overflow-hidden',
        body: 'flex min-h-0 flex-1 flex-col overflow-hidden p-0 sm:p-0'
      }"
    >
      <div class="flex shrink-0 items-center gap-1 border-b border-default px-4 py-2">
        <UButton
          label="Подписание PDF"
          icon="i-lucide-pen-line"
          size="sm"
          :variant="activeTab === 'sign' ? 'soft' : 'ghost'"
          :color="activeTab === 'sign' ? 'primary' : 'neutral'"
          @click="activeTab = 'sign'"
        />
        <UButton
          label="Проверка подписи"
          icon="i-lucide-shield-check"
          size="sm"
          :variant="activeTab === 'verify' ? 'soft' : 'ghost'"
          :color="activeTab === 'verify' ? 'primary' : 'neutral'"
          @click="activeTab = 'verify'"
        />
        <UButton
          label="Мой сертификат"
          icon="i-lucide-badge-check"
          size="sm"
          :variant="activeTab === 'certificate' ? 'soft' : 'ghost'"
          :color="activeTab === 'certificate' ? 'primary' : 'neutral'"
          @click="activeTab = 'certificate'"
        />
      </div>

      <div class="min-h-0 flex-1 overflow-hidden">
        <DocumentSigningWorkspace v-if="activeTab === 'sign'" />
        <DocumentSignatureVerification v-else-if="activeTab === 'verify'" />
        <DocumentSigningCertificate v-else />
      </div>
    </UCard>
  </div>
</template>
