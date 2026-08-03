import type { DocumentStatusColor } from '../model/status-colors'

export interface PersonalDashboardCard {
  id: string
  name: string
  dateText: string
  description?: string
  statusText?: string
  statusColor: DocumentStatusColor
  originText?: string
  executorText?: string
}
