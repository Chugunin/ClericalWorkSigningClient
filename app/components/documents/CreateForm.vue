<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {PersonRightType} from "#shared/types/dictionaries/person-right-type";
import type {DocumentOriginType} from "#shared/types/dictionaries/document-origin-type";
import type {DocumentFileType} from "~~/shared/types/dictionaries/document-file-type";
import type {PersonRoleType} from "#shared/types/dictionaries/person-role-type";
import type {PersonDecisionType} from "#shared/types/dictionaries/person-decision-type";
import type {Person} from "#shared/types/dictionaries/person";
import type {DocumentStatusType} from "#shared/types/dictionaries/document-status-type";

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
    <LayoutAppTwoPaneShell class="min-h-0 flex-1 overflow-hidden" :isLeftPanelCollapsible="false">
     
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

      <template #right-panel>
        <DocumentsCreateFormFilesSection
            v-model="model"
            :file-types="fileTypes"
        />
      </template>
    </LayoutAppTwoPaneShell>

    <DocumentsCreateFormActions
        class="shrink-0"
        @submit="onSubmit"
        @cancel="onCancel"
    />
  </form>
  
</template>

<style scoped>

</style>
