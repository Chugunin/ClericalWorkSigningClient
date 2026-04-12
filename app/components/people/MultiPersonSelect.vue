<script setup lang="ts">
import type {IPersonRoleViewModel} from "~/types/view_models/PersonRoleViewModel";
import type {IPersonViewModel} from "~/types/view_models/PersonViewModel";

const { persons, roleTypes } = await useDictionaries();

const personItems = ref<IPersonViewModel[]>(persons.value.map(p => (
    {
      Id: p.Id,
      IsChecked: false,
      Text: `${p.Rank ?? ''} ${p.Name} (${p.Post ?? ''})`,
      RoleId: undefined,
    })));

const personRoleItems = ref<IPersonRoleViewModel[]>(roleTypes.value.map(r => (
    {
      Id: r.Id,
      Text: r.Description!,
    })));

const filterText = ref('');

const filteredPersonItems = computed(() => {
  return personItems.value
      .filter(i => i.Text.toLowerCase().includes(filterText.value.toLowerCase()))
      .sort((a, b) => Number(b.IsChecked) - Number(a.IsChecked));
});

</script>

<template>
  <div class="flex flex-col flex-1 w-full h-full gap-2 overflow-hidden">
    <div class="flex flex-col justify-center w-full h-10 min-h-10 border border-accented rounded-lg" @click.stop>
      <AppTextInput 
          class="w-full h-full"
          variant="outlined" 
          type="text" 
          placeholder="Введите имя..." 
          v-model="filterText"/>
    </div>

    <div class="flex flex-col flex-1 min-h-0">
      <ul class="flex flex-col gap-1 overflow-auto">
        <li v-for="(personItem) in filteredPersonItems" :key="personItem.Id">

          <div class="flex flex-row p-2 gap-2 justify-between w-full h-10 min-h-10 border border-accented rounded-lg"
               :class="[personItem.IsChecked ? 'border-primary' : 'border-accented']"
               @dblclick="personItem.IsChecked = !personItem.IsChecked">

            <UCheckbox v-model="personItem.IsChecked"/>

            <div
                class="min-w-0 w-full text-left truncate"
                @dblclick.stop="personItem.IsChecked = !personItem.IsChecked">
              {{ personItem.Text }}
            </div>

            <USelectMenu class="w-48 max-w-48 min-w-48"
                         v-model="personItem.RoleId"
                         :items="personRoleItems"
                         value-key="Id"
                         label-key="Text"
                         placeholder="Выберите роль"
                         :variant="personItem.IsChecked ? 'subtle' : 'ghost'"
                         :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200', content: 'min-w-fit' }"
                         :disabled="!personItem.IsChecked"
                         :search-input=false
                         clear
                         clearable>
            </USelectMenu>

          </div>

        </li>
      </ul>
    </div>  
  </div>
</template>

<style scoped>

</style>
