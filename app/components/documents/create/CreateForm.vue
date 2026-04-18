<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {PersonRightType} from "#shared/types/contracts/responses/dictionaries/person-right-type";
import type {DocumentOriginType} from "#shared/types/contracts/responses/dictionaries/document-origin-type";
import type {DocumentFileType} from "#shared/types/contracts/responses/dictionaries/document-file-type";
import type {PersonRoleType} from "#shared/types/contracts/responses/dictionaries/person-role-type";
import type {PersonDecisionType} from "#shared/types/contracts/responses/dictionaries/person-decision-type";
import type {Person} from "#shared/types/contracts/responses/dictionaries/person";
import type {DocumentStatusType} from "#shared/types/contracts/responses/dictionaries/document-status-type";

const model = defineModel<DocumentFormModel>({required: true})

defineProps<{
  persons: Person[]
  rightTypes: PersonRightType[]
  roleTypes: PersonRoleType[]
  decisionTypes: PersonDecisionType[]
  fileTypes: DocumentFileType[]
  originTypes: DocumentOriginType[]
  statusTypes: DocumentStatusType[]
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

function onSubmit() {
  emit('submit')
}

function onCancel() {
  emit('cancel')
}

</script>

<template>
  <form class="flex min-h-0 w-full flex-col gap-4 overflow-hidden" @submit.prevent="onSubmit">
    <LayoutAppThreePaneShell 
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
        <DocumentsCreateFormMainSection
            v-model="model"
            :persons="persons"
            :right-types="rightTypes"
            :role-types="roleTypes"
            :decision-types="decisionTypes"
            :origin-types="originTypes"
            :status-types="statusTypes"
        />
      </template>

      <template #center-panel>
        <DocumentsCreateFormSignersSection
            v-model="model"
            :persons="persons"
            :role-types="roleTypes"
        />
      </template>

      <template #right-panel>
        <DocumentsCreateFormFilesSection
            v-model="model"
            :file-types="fileTypes"
        />
      </template>
      
    </LayoutAppThreePaneShell>

    <DocumentsCreateFormActions
        class="shrink-0"
        @cancel="onCancel"
    />
  </form>
  
</template>

<style scoped>

</style>
