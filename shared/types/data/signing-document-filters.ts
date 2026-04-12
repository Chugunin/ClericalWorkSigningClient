import type { CalendarDate } from '@internationalized/date'

export interface SigningDocumentFilters {
    search?: string | null
    dateSince?: CalendarDate | null
    dateTill?: CalendarDate | null
    statusIds?: number[]
    executorIds?: number[]
}