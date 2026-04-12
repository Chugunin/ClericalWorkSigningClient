import type { CalendarDate } from '@internationalized/date'
import type { Person } from '../dictionaries/person'

export interface DocumentFilters {
    searchText?: string | null
    dateSince?: CalendarDate | null
    dateTill?: CalendarDate | null
    statusIds?: number[]
    executorIds?: number[]
}
