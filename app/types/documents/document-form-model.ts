import type { DateValue } from '@internationalized/date'

export interface DocumentFormModel {
    name?: string
    date?: DateValue
    description?: string
    statusId?: number
    originId?: number
    executorId?: number
    signerIds?: number[]
}
