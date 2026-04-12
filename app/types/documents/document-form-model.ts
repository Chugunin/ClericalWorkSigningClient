import type { CalendarDate } from '@internationalized/date'

export interface DocumentFormModel {
    name?: string
    date?: CalendarDate
    description?: string
    statusId?: number
    originId?: number
    executorId?: number
    signerIds?: number[]
}
