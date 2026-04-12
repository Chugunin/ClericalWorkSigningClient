<script setup lang="ts">

import type {Person} from "#shared/types/dictionaries/person";
import type {PersonRightType} from "#shared/types/dictionaries/person-right-type";
import type {PersonRoleType} from "#shared/types/dictionaries/person-role-type";
import type {PersonDecisionType} from "#shared/types/dictionaries/person-decision-type";
import type {DocumentOriginType} from "#shared/types/dictionaries/document-origin-type";
import type {DocumentStatusType} from "#shared/types/dictionaries/document-status-type";
import type {DocumentFormModel} from "~/types/documents/document-form-model";

const model = defineModel<DocumentFormModel>({required: true})

const props = defineProps<{
  persons: Person[]
  rightTypes: PersonRightType[]
  roleTypes: PersonRoleType[]
  decisionTypes: PersonDecisionType[]
  originTypes: DocumentOriginType[]
  statusTypes: DocumentStatusType[]
}>()

const originTypeItems = computed(() =>
    props.originTypes.map(item => ({
      label: item.Name,
      value: item.Id,
    })),
)

const statusTypeItems = computed(() =>
    props.statusTypes.map(item => ({
      label: item.Description ?? item.Name,
      value: item.Id,
    })),
)

const executorItems = computed(() =>
    props.persons.map(item => ({
      label: `${item.Rank ?? ''} ${item.Name} (${item.Post ?? ''})`,
      value: item.Id,
    })),
)

</script>

<template>
  <UCard
      class="min-h-0 w-full flex-1"
      :ui="{
        root: 'flex h-full min-h-0 flex-col overflow-hidden',
        body: 'min-h-0 flex-1 overflow-auto'
      }"
  >
    <template #header>
      Основная информация
    </template>

    <div class="space-y-4">
      <UFormField label="Кто согласовывает" class="shrink-0">
        <USelectMenu
            v-model="model.executorId"
            :items="executorItems"
            value-key="value"
            option-attribute="label"
            placeholder="Выберите исполнителя"
            class="w-full"
        />
      </UFormField>

      <UFormField label="Что согласовывается" class="shrink-0">
        <USelectMenu
            v-model="model.originId"
            :items="originTypeItems"
            value-key="value"
            option-attribute="label"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'min-w-fit' }"
            :searchInput="false">
        </USelectMenu>
      </UFormField>

      <UFormField label="Реквизиты" class="shrink-0">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UiAppTextInput v-model="model.name" variant="soft" type="text" placeholder="Введите название документа..."/>
          <UiAppDatePicker v-model="model.date" variant="outline" class="w-44 max-w-48 min-w-44 justify-center"/>
        </div>
      </UFormField>

      <UFormField label="Статус" class="shrink-0">
        <USelectMenu
            v-model="model.statusId"
            :items="statusTypeItems"
            value-key="value"
            option-attribute="label"
            placeholder="Выберите статус"
            class="w-full"
        />
      </UFormField>

      <UFormField label="Описание" class="shrink-0">
        <UTextarea v-model="model.description" placeholder="Введите описание документа..." class="w-full"/>
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
