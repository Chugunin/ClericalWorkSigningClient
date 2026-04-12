<script setup lang="ts">

import type {SigningPerson} from "#shared/types/dictionaries/signing-person";
import type {SigningPersonRightType} from "#shared/types/dictionaries/signing-person-right-type";
import type {SigningPersonRoleType} from "#shared/types/dictionaries/signing-person-role-type";
import type {SigningPersonDecisionType} from "#shared/types/dictionaries/signing-person-decision-type";
import type {SigningDocumentOriginType} from "#shared/types/dictionaries/signing-document-origin-type";
import type {SigningDocumentStatusType} from "#shared/types/dictionaries/signing-document-status-type";
import type {DocumentFormModel} from "~/types/documents/document-form-model";

const model = defineModel<DocumentFormModel>({required: true})

const props = defineProps<{
  persons: SigningPerson[]
  rightTypes: SigningPersonRightType[]
  roleTypes: SigningPersonRoleType[]
  decisionTypes: SigningPersonDecisionType[]
  originTypes: SigningDocumentOriginType[]
  statusTypes: SigningDocumentStatusType[]
}>()

const originTypeItems = computed(() =>
    props.originTypes.map(item => ({
      label: item.Name,
      value: item.Id,
    })),
)

</script>

<template>
  <UCard>
    <template #header>
      Основная информация
    </template>

    <div class="space-y-4">
      <UFormField label="Кто согласовывает" class="shrink-0">
<!--        <AppSinglePersonPicker/>-->
      </UFormField>

      <UFormField label="Что согласовывается" class="shrink-0">
        <USelectMenu
            :v-model="model.originId"
            :items="originTypeItems"
            value-key="value"
            option-attribute="label"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'min-w-fit' }"
            :searchInput="false">
        </USelectMenu>
      </UFormField>

      <UFormField label="Реквизиты" class="shrink-0">
        <UiAppTextInput variant="soft" type="text" placeholder="Введите название документа..."></UiAppTextInput>
        <UiAppDatePicker variant="outline" class="w-44 max-w-48 min-w-44 justify-center"/>
      </UFormField>

      <UFormField label="С кем согласовывается" class="shrink-0">
<!--          <AppMultiPersonCollapsiblePicker id="signers"/>-->
      </UFormField>

      <UFormField label="Связанные документы" class="shrink-0">
      </UFormField>

    </div>

  </UCard>
</template>

<style scoped>

</style>