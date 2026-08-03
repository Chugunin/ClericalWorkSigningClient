<script setup lang="ts">
import { formatDate } from '~/shared/lib/date'

import type {TableColumn} from '@nuxt/ui'
import type { Document } from '#shared/contracts/documents/document.contract'
import type { DocumentStatusType } from '#shared/contracts/dictionaries/dictionary-item.contract'
import type { Person } from '#shared/contracts/dictionaries/person.contract'
import type { Department } from '#shared/contracts/dictionaries/department.contract'
import {UButton} from "#components"

const props = withDefaults(defineProps<{
  documents: Document[]
  statusById: Map<number, DocumentStatusType>
  personById: Map<number, Person>
  departmentById: Map<number, Department>
  loading?: boolean
}>(), {
  loading: false
})

const columns: TableColumn<Document>[] = [
  {
    accessorKey: 'Id',
    header: '#',
    cell: ({row}) => {
      const value = row.getValue('Id') as string | number | undefined
      return value ? `#${value}` : '—'
    },
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
    cell: ({row}) => {
      return (row.getValue('Name') as string | undefined) || '—'
    },
  },
  {
    accessorKey: 'Description',
    header: 'Содержание',
    cell: ({row}) => {
      const value = row.getValue('Description') as string | undefined
      return value || '—'
    },
    meta: {
      class: {
        td: 'max-w-[420px] truncate',
      }
    },
  },
  {
    accessorKey: 'CreatedDate',
    header: 'Дата документа',
    cell: ({row}) => {
      const value = row.getValue('CreatedDate') as string | undefined
      return formatDate(value) || '—'
    },
  },
  {
    accessorKey: 'StatusId',
    header: 'Статус',
    cell: ({row}) => {
      const statusId = row.getValue('StatusId') as number | undefined
      if (!statusId) return '—'

      const status = props.statusById.get(statusId)
      return status?.Description ?? status?.Name ?? '—'
    }
  },
  {
    accessorKey: 'ExecutorId',
    header: 'Исполнитель',
    cell: ({row}) => {
      const executorId = row.getValue('ExecutorId') as number | undefined
      if (!executorId) return '—'

      const executor = props.personById.get(executorId)
      if (!executor) return '—'

      const department = executor.DepartmentId
          ? props.departmentById.get(executor.DepartmentId)
          : undefined

      return department
          ? `${executor.Name} (${department.Name})`
          : executor.Name
    }
  },
]

const columnVisibility = ref({Id: false});

</script>

<template>
  <UTable
      :data="documents"
      :columns="columns"
      :loading="loading"
      :column-visibility="columnVisibility"
      empty="По выбранным фильтрам ничего не найдено"
      sticky="header"
      class="w-full"
  />
</template>
