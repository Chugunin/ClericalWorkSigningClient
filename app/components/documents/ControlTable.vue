<script setup lang="ts">

import type {TableColumn} from '@nuxt/ui'
import {UButton} from "#components";
import type {SigningDocument} from "#shared/types/data/signing-document";
import type {SigningPerson} from "#shared/types/dics/signing-person";
import type {SigningDepartment} from "#shared/types/dics/signing-department";
import GetSigningDepartments from "~/composables/dics/GetSigningDepartments";
import GetSigningPersons from "~/composables/dics/GetSigningPersons";
import GetSigningDocumentStatusTypes from "~/composables/dics/GetSigningDocumentStatusTypes";
import GetSigningDocuments from "~/composables/data/GetSigningDocuments";

const signingStatusTypes = await GetSigningDocumentStatusTypes();
const signingPersons = await GetSigningPersons();
const signingDepartments = await GetSigningDepartments();

const columns: TableColumn<SigningDocument>[] = [
  {
    accessorKey: 'Id',
    header: '#',
    cell: ({row}) => `#${row.getValue('Id')}`,
  },
  {
    id: 'expand',
    cell: ({row}) =>
        h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          icon: 'i-lucide-chevron-down',
          square: true,
          'aria-label': 'Expand',
          ui: {
            leadingIcon: [
              'transition-transform',
              row.getIsExpanded() ? 'duration-200 rotate-180' : ''
            ]
          },
          onClick: () => row.toggleExpanded()
        })
  },
  {
    accessorKey: 'Name',
    header: 'Наименование документа',
  },
  {
    accessorKey: 'Description',
    header: 'Содержание'
  },
  {
    accessorKey: 'CreatedDatetime',
    header: ({column}) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Дата документа',
        icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => {
          column.toggleSorting(undefined, true)
        }
      })
    },
    cell: ({row}) => {
      if (!row.getValue('CreatedDatetime')) {
        return ''
      }
      return new Date(row.getValue('CreatedDatetime')).toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      })
    }
  },
  {
    accessorKey: 'StatusId',
    header: ({column}) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Статус',
        icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => {
          column.toggleSorting(undefined, true)
        }
      })
    },
    cell: ({row}) => {
      const statusId = row.getValue('StatusId') as (number | undefined);

      if (!statusId)
        return '';

      return signingStatusTypes.value.find(s => s.Id == statusId)?.Description ?? '';
    }
  },
  {
    accessorKey: 'ExecutorId',
    header: ({column}) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Исполнитель',
        icon: isSorted ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => {
          column.toggleSorting(undefined, true)
        }
      })
    },
    cell: ({row}) => {
      const executorId = row.getValue('ExecutorId') as (number | undefined);

      if (!executorId)
        return '';

      const executor = signingPersons.value.find(p => p.Id == executorId) as (SigningPerson | undefined);

      if (!executor)
        return '';

      const department = signingDepartments.value.find(d => d.Id == executor!.DepartmentId) as (SigningDepartment | undefined);

      return `${executor.Name} (${department?.Name ?? ''})`
    }
  },
]
const columnsVisibility = ref({Id: false});
const data = ref<SigningDocument[]>((await GetSigningDocuments()).value);

</script>

<template>
  <!--      class="h-170"-->
  <UTable

      ref="table"
      sticky
      v-model:column-visibility="columnsVisibility"
      :data="data"
      :columns="columns"/>
  <!--  <div class="flex justify-end border-t border-default pt-4 px-4">
    </div>-->

</template>

<style scoped>

</style>