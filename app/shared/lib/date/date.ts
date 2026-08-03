import {CalendarDate, type DateValue, getLocalTimeZone, today} from '@internationalized/date'

export const MinimalDate: DateValue = new CalendarDate(2000, 1, 1);
export const MaximalDate: DateValue = getTodayDateValue();

export type DateRange = {
    start: DateValue
    end: DateValue
} | undefined

export const Periods = [
    {label: 'День', value: 'day'},
    {label: 'Неделя', value: 'week'},
    {label: 'Месяц', value: 'month'},
    {label: 'Всё время', value: 'allTime'},
] as const

export type PeriodValue = typeof Periods[number]['value']

export function formatDate(value: string | Date | null | undefined): string {
    if (!value) return ''

    const date = typeof value === 'string' ? new Date(value) : value

    if (isNaN(date.getDate())) return ''

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
}

export function formatCalendarDate(value: DateValue | null | undefined): string {
    if (!value) return ''

    const day = String(value.day).padStart(2, '0')
    const month = String(value.month).padStart(2, '0')
    const year = value.year

    return `${day}.${month}.${year}`
}

export function formatDateToISO(value: DateValue | null | undefined): string | undefined {
    if (!value) return undefined

    const day = String(value.day).padStart(2, '0')
    const month = String(value.month).padStart(2, '0')
    const year = value.year

    return `${year}-${month}-${day}`
}

export function getTodayDateValue(): DateValue {
    return new CalendarDate(
        today(getLocalTimeZone()).year,
        today(getLocalTimeZone()).month,
        today(getLocalTimeZone()).day);
}