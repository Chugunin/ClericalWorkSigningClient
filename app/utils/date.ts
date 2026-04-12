import type { CalendarDate } from '@internationalized/date'

export function formatDate(value: string | Date | null | undefined): string {
    if (!value) return ''

    const date = typeof value === 'string' ? new Date(value) : value

    if (isNaN(date.getTime())) return ''

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
}

export function formatCalendarDate(value: CalendarDate | null | undefined): string {
    if (!value) return ''

    const day = String(value.day).padStart(2, '0')
    const month = String(value.month).padStart(2, '0')
    const year = value.year

    return `${day}.${month}.${year}`
}