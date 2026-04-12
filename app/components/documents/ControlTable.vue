<script setup lang="ts">

import type {TableColumn} from '@nuxt/ui'
import {UButton} from "#components";
import type {Document} from "#shared/types/data/document";
import type {Person} from "#shared/types/dictionaries/person";
import type {Department} from "#shared/types/dictionaries/department";
import type {DocumentStatusType} from "#shared/types/dictionaries/document-status-type";

const props = defineProps<{
  documents: Document[]
  statusById: Map<number, DocumentStatusType>
  personById: Map<number, Person>
  departmentById: Map<number, Department>
}>()

const columns: TableColumn<Document>[] = [
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
    accessorKey: 'CreatedDate',
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
      if (!row.getValue('CreatedDate')) {
        return ''
      }
      return new Date(row.getValue('CreatedDate')).toLocaleString('ru-RU', {
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

      return props.statusById.get(statusId)?.Description ?? props.statusById.get(statusId)?.Name ?? '';
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

      const executor = props.personById.get(executorId);

      if (!executor)
        return '';

      const department = props.departmentById.get(executor.DepartmentId);

      return `${executor.Name} (${department?.Name ?? ''})`
    }
  },
]
const columnsVisibility = ref({Id: false});

</script>

<template>
  <!--      class="h-170"-->
  <UTable

      ref="table"
      sticky
      v-model:column-visibility="columnsVisibility"
      :data="props.documents"
      :columns="columns"/>
  <!--  <div class="flex justify-end border-t border-default pt-4 px-4">
    </div>-->

</template>

<style scoped>

</style>
