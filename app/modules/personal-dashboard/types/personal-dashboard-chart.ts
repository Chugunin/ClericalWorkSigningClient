import type { DocumentStatusColor } from '../model/status-colors'

export interface PersonalDashboardChartItem {
  statusId: number
  label: string
  count: number
  color: DocumentStatusColor
}
