import type { DateValue } from '@internationalized/date'
import type { Person } from '#shared/types/contracts/responses/dictionaries/person'

export interface DocumentFilters {
    SearchText?: string
    DateSince?: string
    DateTill?: string
    StatusIds?: number[]
    ExecutorIds?: number[]
}