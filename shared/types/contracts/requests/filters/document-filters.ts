import type { DateValue } from '@internationalized/date'
import type { Person } from '#shared/types/contracts/responses/dictionaries/person'

export interface DocumentFilters {
    searchText?: string
    dateSince?: DateValue
    dateTill?: DateValue
    statusIds: number[]
    executorIds: number[]
}