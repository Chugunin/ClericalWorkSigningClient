<script setup lang="ts">
import GetSigningPersons from "~/composables/dics/GetSigningPersons";
import type {IPersonViewModel} from "~/types/view_models/PersonViewModel";

const persons = await GetSigningPersons();

const personItems = ref<IPersonViewModel[]>(persons.value.map(p => (
    {
      Id: p.Id,
      IsChecked: false,
      Text: `${p.Rank ?? ''} ${p.Name} (${p.Post ?? ''})`,
      RoleId: undefined,
    })));

const selectedPersonId = ref<number | undefined>();

</script>

<template>
  <USelectMenu
      v-model="selectedPersonId"
      :items="personItems"
      valueKey="Id"
      labelKey="Text"
      placeholder="Выберите сотрудника"
      :variant="selectedPersonId ? 'soft' : 'outline'"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'min-w-fit' }"
      :searchInput="{placeholder: 'Поиск'}"
      clear
      clearable>
    <template #empty>
      <div>Не найдено</div>
    </template>
  </USelectMenu>
</template>

<style scoped>

</style>