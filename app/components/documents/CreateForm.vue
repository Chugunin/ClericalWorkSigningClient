<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {SigningPersonRightType} from "#shared/types/dictionaries/signing-person-right-type";
import type {SigningDocumentOriginType} from "#shared/types/dictionaries/signing-document-origin-type";
import type {SigningDocumentFileType} from "~~/shared/types/dictionaries/signing-document-file-type";
import type {SigningPersonRoleType} from "#shared/types/dictionaries/signing-person-role-type";
import type {SigningPersonDecisionType} from "#shared/types/dictionaries/signing-person-decision-type";
import type {SigningPerson} from "#shared/types/dictionaries/signing-person";
import type {SigningDocumentStatusType} from "#shared/types/dictionaries/signing-document-status-type";

const model = defineModel<DocumentFormModel>({required: true})

defineProps<{
  persons: SigningPerson[]
  rightTypes: SigningPersonRightType[]
  roleTypes: SigningPersonRoleType[]
  decisionTypes: SigningPersonDecisionType[]
  fileTypes: SigningDocumentFileType[]
  originTypes: SigningDocumentOriginType[]
  statusTypes: SigningDocumentStatusType[]
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
  <form class="space-y-6" @submit.prevent="onSubmit">
    <LayoutTwoPaneShell :isLeftPanelCollapsible="false">
      <template #left-panel>
        <DocumentsCreateFormMainSection
            v-model="model"
            :persons="persons"
            :right-types="rightTypes"
            :roleTypes="roleTypes"
            :decisionTypes="decisionTypes"
            :originTypes="originTypes"
            :statusTypes="statusTypes"
        />
      </template>

      <template #right-panel>
        <DocumentsCreateFormFilesSection
            v-model="model"
            :file-types="fileTypes"
        />
      </template>
    </LayoutTwoPaneShell>

    <DocumentsCreateFormActions
        @submit="onSubmit"
        @cancel="onCancel"
    />
  </form>
  
  <!--  <TwoSplitPanelsLayout :isLeftPanelCollapsible="false" :isRightPanelCollapsible="true">
      <template #leftPanel>
  
        <div id="header" class="flex shrink-0 justify-center mt-1 mb-1 w-full max-w-full h-8 max-h-1/10 min-h-8">
          <span class="content-center font-bold text-2xl">Новый документ</span>
        </div>
  
        <USeparator orientation="horizontal"/>
  
        <div id="content" class="flex flex-col justify-start flex-1 gap-3 w-full max-w-full min-h-0 overflow-auto">
  
  
          
        </div>
  
        <USeparator orientation="horizontal" class="shrink-0"/>
  
        <div id="footer" class="flex shrink-0 justify-center mt-1 mb-1 w-full max-w-full h-8 max-h-1/10 min-h-8">
          <span class="content-center font-bold text-2xl">Новый документ</span>
        </div>
  
      </template>
  
      <template #rightPanel>
      </template>
  
    </TwoSplitPanelsLayout>-->
  
</template>

<style scoped>

</style>