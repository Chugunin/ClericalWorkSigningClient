<script setup lang="ts">

import type {DocumentFormModel} from "~/types/documents/document-form-model";
import type {Person} from "#shared/types/dictionaries/person";
import type {PersonRoleType} from "#shared/types/dictionaries/person-role-type";

interface SignerItem {
  isChecked: boolean
  label: string
  value: number
  roleId?: number
}

interface RoleItem {
  label: string
  value: number
}

const model = defineModel<DocumentFormModel>({required: true})

const props = defineProps<{
  persons: Person[]
  roleTypes: PersonRoleType[]
}>()

const signerItems = ref<SignerItem[]>(
    props.persons.map(item => ({
      isChecked: false,
      label: `${item.Name}`,
      value: item.Id,
      roleId: undefined,
    }))
)

const roleItems = computed<RoleItem[]>(() =>
    props.roleTypes.map(item => ({
      label: `${item.Description}`,
      value: item.Id,
    })),
)

const filterText = ref('')

const hasSelectedSignerItems = computed(() =>
    signerItems.value.some(item => item.isChecked),
)

const filteredSignerItems = computed(() => {
  return signerItems.value
      .filter(i => i.label.toLowerCase().includes(filterText.value.toLowerCase()))
      .sort((a, b) => {
        const aHasSelectedRole = a.isChecked && a.roleId != null
        const bHasSelectedRole = b.isChecked && b.roleId != null

        return Number(bHasSelectedRole) - Number(aHasSelectedRole)
      })
})

watch(signerItems, syncSignerIdsWithModel, {deep: true, immediate: true})

function setSignerItemChecked(item: SignerItem, isChecked: boolean) {
  item.isChecked = isChecked

  if (!item.isChecked)
    item.roleId = undefined
}

function toggleSignerItem(item: SignerItem) {
  setSignerItemChecked(item, !item.isChecked)
}

function clearSignerItemsSelection() {
  signerItems.value.forEach(item => setSignerItemChecked(item, false))
}

function syncSignerIdsWithModel() {
  model.value.signerIds = signerItems.value
      .flatMap(item => {
        if (!item.isChecked || item.roleId == null)
          return []

        return [{
          signerId: item.value,
          roleId: item.roleId,
        }]
      })
}

</script>

<template>
  <div class="flex min-h-0 w-full flex-1 flex-col">
    <UCard
        class="min-h-0 w-full flex-1"
        :ui="{
          root: 'flex h-full min-h-0 flex-col overflow-hidden',
          body: 'min-h-0 flex-1 overflow-hidden'
        }"
    >
      <template #header>
        С кем согласовывается
      </template>

      <UFormField
          class="signers-field h-full min-h-0"
          :ui="{
            root: 'flex h-full min-h-0 flex-col overflow-hidden',
            wrapper: 'shrink-0'
          }"
      >
        <div class="flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden">
          <div class="flex shrink-0 gap-2">
            
            <UiAppTextInput
                v-model="filterText"
                class="min-w-0 flex-1"
                color="neutral"
                variant="soft"
                type="text"
                placeholder="Начните вводить имя сотрудника"
            />

            <UTooltip text="Очистить выделение">
              <UButton
                  class="shrink-0"
                  color="neutral"
                  variant="soft"
                  icon="i-lucide-x"
                  :disabled="!hasSelectedSignerItems"
                  @click="clearSignerItemsSelection"
              />  
            </UTooltip>

          </div>

          <div class="min-h-0 flex-1 overflow-y-auto">
            <ul class="flex min-h-0 flex-col gap-2">
              <li v-for="signerItem in filteredSignerItems" :key="signerItem.value">

                <div class="flex flex-row p-2 gap-2 items-center border border-accented rounded-lg"
                     :class="[signerItem.isChecked ? 'border-primary' : 'border-accented']"
                     @click="toggleSignerItem(signerItem)"
                >

                  <div class="min-w-0 w-full pl-1 text-left truncate cursor-default">
                    {{ signerItem.label }}
                  </div>

                  <USelectMenu v-model="signerItem.roleId"
                               :items="roleItems"
                               value-key="value"
                               label-key="label"
                               placeholder="Выберите роль"
                               size="sm"
                               :variant="signerItem.isChecked ? 'subtle' : 'ghost'"
                               :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'min-w-fit' }"
                               :disabled="!signerItem.isChecked"
                               :search-input="false"
                               clear
                               clearable
                               @click.stop
                  />

                </div>

              </li>
            </ul>
          </div>
        </div>
      </UFormField>

    </UCard>
  </div>
</template>

<style scoped>
:deep(.signers-field > div:last-child) {
  min-height: 0;
  flex: 1 1 0%;
  overflow: hidden;
}
</style>
