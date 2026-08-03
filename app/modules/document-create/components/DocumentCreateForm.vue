<script setup lang="ts">
import { AppThreePaneShell } from '~/shared/layout'

import type {DocumentFormModel} from "../model/document-create-form.model";
import type {DocumentOriginType} from "#shared/contracts/dictionaries/dictionary-item.contract";
import type {DocumentFileType} from "#shared/contracts/dictionaries/dictionary-item.contract";
import type {PersonRoleType} from "#shared/contracts/dictionaries/dictionary-item.contract";
import type {Person} from "#shared/contracts/dictionaries/person.contract";
import type {DocumentStatusType} from "#shared/contracts/dictionaries/dictionary-item.contract";
import DocumentCreateFilesSection from './DocumentCreateFilesSection.vue'
import DocumentCreateMainSection from './DocumentCreateMainSection.vue'
import DocumentCreateSignersSection from './DocumentCreateSignersSection.vue'
import DocumentCreateFormActions from './DocumentCreateFormActions.vue'

const model = defineModel<DocumentFormModel>({required: true})

const filesSectionRef = ref<InstanceType<typeof DocumentCreateFilesSection> | null>(null)

defineProps<{
  submitting?: boolean
  persons: Person[]
  roleTypes: PersonRoleType[]
  fileTypes: DocumentFileType[]
  originTypes: DocumentOriginType[]
  statusTypes: DocumentStatusType[]
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

async function onSubmit() {
  model.value.files = await filesSectionRef.value?.saveAll() ?? []
  
  emit('submit')
}

function onCancel() {
  emit('cancel')
}

</script>

<template>
  <form class="flex min-h-0 w-full flex-col gap-4 overflow-hidden" @submit.prevent="onSubmit">
    <AppThreePaneShell 
        class="min-h-0 flex-1 overflow-hidden" 
        layout-state-key="documents-create-form"
        :default-sizes="[30, 30, 40]"
        :min-sizes="[30, 40, 10]"
        :is-left-panel-collapsible="false"
        :is-left-panel-resizable="false"
        :is-center-panel-collapsible="false"
        :is-right-panel-enabled="true"
    >
     
      <template #left-panel>
        <DocumentCreateMainSection
            v-model="model"
            :persons="persons"
            :origin-types="originTypes"
            :status-types="statusTypes"
        />
      </template>

      <template #center-panel>
        <DocumentCreateSignersSection
            v-model="model"
            :persons="persons"
            :role-types="roleTypes"
        />
      </template>

      <template #right-panel>
        <DocumentCreateFilesSection
            ref="filesSectionRef"
            v-model="model"
            :file-types="fileTypes"
        />
      </template>
      
    </AppThreePaneShell>

    <DocumentCreateFormActions
        class="shrink-0"
        :submitting="submitting"
        @submit="onSubmit"
        @cancel="onCancel"
    />
  </form>
  
</template>

<style scoped>

</style>
