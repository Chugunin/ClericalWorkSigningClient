export function hasActiveFilters<T extends object>(
    filters: T | null | undefined,
): boolean {
  if (!filters) {
    return false
  }

  return Object.values(filters).some((value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }

    if (Array.isArray(value)) {
      return value.length > 0
    }

    return value !== null && value !== undefined
  })
}