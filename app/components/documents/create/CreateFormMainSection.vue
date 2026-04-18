<script setup lang="ts">

import type {Person} from "#shared/types/contracts/responses/dictionaries/person";
import type {PersonRightType} from "#shared/types/contracts/responses/dictionaries/person-right-type";
import type {PersonRoleType} from "#shared/types/contracts/responses/dictionaries/person-role-type";
import type {PersonDecisionType} from "#shared/types/contracts/responses/dictionaries/person-decision-type";
import type {DocumentOriginType} from "#shared/types/contracts/responses/dictionaries/document-origin-type";
import type {DocumentStatusType} from "#shared/types/contracts/responses/dictionaries/document-status-type";
import type {DocumentFormModel} from "~/types/documents/document-form-model";

const model = defineModel<DocumentFormModel>({required: true})

const props = defineProps<{
  persons: Person[]
  originTypes: DocumentOriginType[]
}>()

const originTypeItems = computed(() =>
    props.originTypes.map(item => ({
      label: item.Description,
      value: item.Id,
    })),
)

const executorItems = computed(() =>
    props.persons.map(item => ({
      label: `${item.Name}`,
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
            clear
        />
      </UFormField>

      <UFormField label="Что согласовывается" class="shrink-0">
        <USelectMenu
            v-model="model.originId"
            :items="originTypeItems"
            value-key="value"
            option-attribute="label"
            placeholder="Выберите тип документа"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'min-w-fit' }"
            :searchInput="false"
            class="w-full"
            clear
        />
      </UFormField>

      <UFormField label="Реквизиты" class="shrink-0">
        <div class="flex flex-col items-center gap-2">
          <UiAppTextInput
              v-model="model.name"
              variant="soft"
              type="text"
              placeholder="Введите название документа"
              class="w-full"
          />
          <div class="flex flex-row justify-between w-full gap-2">
            <UBadge
                label="Дата документа"
                color="primary"
                variant="soft"
            />
            <UiAppDatePicker
                v-model="model.date"
                variant="outline"
                class="w-full justify-center"
            />
          </div>
          <UTextarea
              v-model="model.description"
              placeholder="Введите описание документа"
              class="w-full"
              :rows="4"
              
              autoresize
          />
        </div>
      </UFormField>

    </div>

  </UCard>
</template>

<style scoped>

</style>
