<script setup lang="ts">
import {SigningPersons} from "~/composables/AppDictionaries";
import type {ISignerViewModel} from "~/types/view_models/person_view_model";
import type {ISigningPerson} from "#shared/types/signing/dics";
import type {TableColumn} from "@nuxt/ui";
import {UCheckbox} from "#components";
import type {IAuthResponse} from "#shared/types/auth/auth";



const user = useAuthStore();

const details = ref('Название документа получать из имени файла')
const filterPerson = ref('')
const disabled = ref<boolean>(true)

const valueFile = ref(null)

const fileName = ref<string[]>([])

const dataPerson = (await SigningPersons()).value.map(sp => <ISignerViewModel>{
  IsChecked: false,
  Text: `${sp.Rank} ${sp.Name} (${sp.Post})`,
  SigningPerson: sp,
});

const itemsExecutor = ref(dataPerson.map(s => <string>(
  s.Text)))

const executor = ref(dataPerson.find(s => s.SigningPerson?.Login == user.user.login)?.Text)

const columns: TableColumn<any>[] = [
  {
    id: 'select',
    header: '',
    accessorKey: 'IsChecked',
    cell: ({row}) => h(UCheckbox, {
      // Привязываем напрямую к значению IsChecked
      modelValue: row.original.IsChecked,
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
        const isChecked = !!value

        // Обновляем данные
        row.original.IsChecked = isChecked

        // Триггерим реактивность
        const index = dataPerson.findIndex(item => item.SigningPerson === row.original.SigningPerson)
        if (index !== -1) {
          dataPerson[index] = {...row.original}
        }

        const response = $fetch('/api/createDoc/createDoc', {
          method: 'POST',
          body: {
            file: valueFile,
          }
        });

        console.log(valueFile)
      },
      'aria-label': 'Select row'
    })
  },
  {
    id: 'person',
    header: '',
    accessorKey:
        'Text',
  }
]



</script>

<template>
  <div class="flex flex-col w-full h-full gap-2.5 p-0">
    <!-- Исполнитель -->
    <div class="flex border border-accented rounded-lg  p-0 items-center gap-2">
      <span class="text-sm font-medium whitespace-nowrap">Исполнитель:</span>
      <UInputMenu
          class="flex-3"
          v-model="executor"
          icon="i-lucide-search"
          size="md"
          :items="itemsExecutor"
      />
    </div>

    <!-- Название -->
    <div class="flex border border-accented rounded-lg p-0">
      <UInput
          :disabled="disabled"
          class="w-full"
          v-model="details"
          placeholder="Название"
          :ui="{ trailing: 'pe-1' }"
      >
        <template v-if="details?.length" #trailing>
          <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-circle-x"
              aria-label="Clear input"
              @click="details = ''; disabled = false"
          />
        </template>
      </UInput>
    </div>

    <!-- Файлы -->
    <div class="h-[30%] border border-accented rounded-lg bg-blue-200  overflow-hidden">
      <UFileUpload
          position="inside"
          multiple
          layout="list"
          v-model="valueFile"
          label="Выбрать файлы"
          description="SVG, PNG, JPG or GIF (max. 2MB)"
          class="flex w-full h-full "
          :ui="{
          base: 'h-full overflow-y-auto !justify-start !items-center !gap-0',
        }"
      />
    </div>

    <!-- С кем -->
    <div class="h-[60%] border border-accented rounded-lg">
      <div class="flex px-4 py-3.5 border-b border-accented">
        <UInput v-model="filterPerson" class="w-full" placeholder="Поиск..." :ui="{ trailing: 'pe-1' }">
          <template v-if="filterPerson?.length" #trailing>
            <UButton
                color="neutral"
                variant="link"
                size="sm"
                icon="i-lucide-circle-x"
                aria-label="Clear input"
                @click="filterPerson = '' "
            />
          </template>
        </UInput>
      </div>
      <UTable
          ref="table"
          class="flex h-[83%]"
          :ui="{
              thead: 'hidden'
          }"
          sticky

          v-model:global-filter="filterPerson"
          :data="dataPerson"
          :columns="columns"

      />

    </div>
  </div>
</template>


<style scoped>

</style>