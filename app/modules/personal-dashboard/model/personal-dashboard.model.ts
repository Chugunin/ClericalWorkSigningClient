import { getDocumentStatusColor } from './status-colors.ts'

import type { PersonalDashboardCard } from '../types/personal-dashboard-card'
import type { PersonalDashboardChartItem } from '../types/personal-dashboard-chart'

export type DashboardSortDirection = 'asc' | 'desc' | null

export type DashboardDocument = {
  Id?: string
  Name: string
  Description?: string
  CreatedDate?: string | Date
  StatusId?: number | null
  OriginId?: number | null
  ExecutorId?: number | null
}

export type DashboardLookupItem = {
  id: number
  Description?: string
  Name?: string
}

export type BuildPersonalDashboardModelOptions = {
  documents: DashboardDocument[]
  statusTypes: DashboardLookupItem[]
  originTypes: DashboardLookupItem[]
  persons: DashboardLookupItem[]
  hiddenStatusIds: number[]
  sortDirection: DashboardSortDirection
  formatDate: (value: string | Date) => string
}

export function buildPersonalDashboardModel(
  options: BuildPersonalDashboardModelOptions,
): { cards: PersonalDashboardCard[]; chartItems: PersonalDashboardChartItem[] } {
  const statusTypeById = new Map(options.statusTypes.map(item => [item.id, item]))
  const originTypeById = new Map(options.originTypes.map(item => [item.id, item]))
  const personById = new Map(options.persons.map(item => [item.id, item]))
  const hiddenStatusIds = new Set(options.hiddenStatusIds)
  const groups = new Map<number, DashboardDocument[]>()

  for (const document of options.documents) {
    if (!document.Id || document.StatusId == null) continue
    const items = groups.get(document.StatusId) ?? []
    items.push(document)
    groups.set(document.StatusId, items)
  }

  const cards: PersonalDashboardCard[] = []
  const chartItems: PersonalDashboardChartItem[] = []

  for (const [statusId, documents] of groups) {
    const statusText = statusTypeById.get(statusId)?.Description ?? ''
    const statusColor = getDocumentStatusColor(statusId)

    chartItems.push({
      statusId,
      label: statusText,
      count: documents.length,
      color: statusColor,
    })

    if (hiddenStatusIds.has(statusId)) continue

    for (const document of documents) {
      cards.push({
        id: document.Id!,
        name: document.Name,
        dateText: document.CreatedDate ? options.formatDate(document.CreatedDate) : '',
        description: document.Description,
        statusText,
        statusColor,
        originText: document.OriginId == null
          ? ''
          : originTypeById.get(document.OriginId)?.Description ?? '',
        executorText: document.ExecutorId == null
          ? ''
          : personById.get(document.ExecutorId)?.Name ?? '',
      })
    }
  }

  if (options.sortDirection) {
    const direction = options.sortDirection === 'asc' ? 1 : -1
    cards.sort((left, right) => direction * left.dateText.localeCompare(right.dateText))
  }

  return { cards, chartItems }
}

export function toggleDashboardStatus(
  hiddenStatusIds: number[],
  statusId: number,
): number[] {
  return hiddenStatusIds.includes(statusId)
    ? hiddenStatusIds.filter(id => id !== statusId)
    : [...hiddenStatusIds, statusId]
}

export function invertDashboardStatuses(
  chartItems: PersonalDashboardChartItem[],
  hiddenStatusIds: number[],
): number[] {
  const hidden = new Set(hiddenStatusIds)
  return chartItems.map(item => item.statusId).filter(statusId => !hidden.has(statusId))
}

export function getNextDashboardSortDirection(
  direction: DashboardSortDirection,
): DashboardSortDirection {
  if (direction === null) return 'desc'
  if (direction === 'desc') return 'asc'
  return null
}
