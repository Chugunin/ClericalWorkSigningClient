//export type SortOrder = 'asc' | 'desc' | null
export const SortOrders = [
    {direction: 'asc', icon: 'i-lucide-arrow-up', tooltip: 'Сортировка: сначала старые'},
    {direction: 'desc', icon: 'i-lucide-arrow-down', tooltip: 'Сортировка: сначала новые'},
    {direction: null, icon: 'i-lucide-arrow-down-up', tooltip: 'Без сортировки'},
] as const

export type SortDirection = typeof SortOrders[number]['direction']

export function GetSortOrderByDirection(direction: SortDirection) {
    return SortOrders.find(x => x.direction === direction)!
}

