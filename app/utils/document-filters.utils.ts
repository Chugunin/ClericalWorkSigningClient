export function hasActiveFilters(
    filters?: Record<string, unknown> | null,
): boolean {

    if (!filters)
        return false

    return Object.values(filters).some((value) => {

        if (Array.isArray(value))
            return value.length > 0

        return value !== null &&
            value !== undefined &&
            value !== ''

    })

}