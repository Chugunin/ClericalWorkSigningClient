export interface DictionariesCacheSnapshot<TData> {
  data: TData | null
  isLoading: boolean
  error: string | null
}

export interface DictionariesCache<TData> {
  load: (force?: boolean) => Promise<TData | null>
  clear: () => void
  getSnapshot: () => DictionariesCacheSnapshot<TData>
}

export interface DictionariesCacheDependencies<TData> {
  fetchData: () => Promise<TData>
  getErrorMessage: (error: unknown) => string
}

export function createDictionariesCache<TData>(
  dependencies: DictionariesCacheDependencies<TData>,
): DictionariesCache<TData> {
  let data: TData | null = null
  let isLoading = false
  let error: string | null = null
  let pendingRequest: Promise<TData | null> | null = null

  async function executeLoad(): Promise<TData | null> {
    isLoading = true
    error = null

    try {
      data = await dependencies.fetchData()
      return data
    }
    catch (loadError) {
      error = dependencies.getErrorMessage(loadError)
      return null
    }
    finally {
      isLoading = false
      pendingRequest = null
    }
  }

  return {
    load(force = false) {
      if (data !== null && !force)
        return Promise.resolve(data)

      if (pendingRequest)
        return pendingRequest

      pendingRequest = executeLoad()
      return pendingRequest
    },

    clear() {
      data = null
      error = null
      isLoading = false
      pendingRequest = null
    },

    getSnapshot: () => ({ data, isLoading, error }),
  }
}
