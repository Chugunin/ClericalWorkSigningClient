import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useApiError } from '~/shared/composables'

import { DictionariesApi } from '../api/dictionaries.api'
import { createDictionariesCache } from '../lib/dictionaries-cache'

import type { DictionariesResponse } from '#shared/contracts/dictionaries/dictionaries-response.contract'

export const useDictionariesStore = defineStore('dictionaries', () => {
  const data = ref<DictionariesResponse | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const apiError = useApiError()

  const cache = createDictionariesCache<DictionariesResponse>({
    fetchData: () => DictionariesApi.getAll(),
    getErrorMessage: loadError => apiError.getMessage(loadError),
  })

  const isLoaded = computed(() => data.value !== null)
  const departments = computed(() => data.value?.Departments ?? [])
  const persons = computed(() => data.value?.Persons ?? [])
  const documentFileTypes = computed(() => data.value?.DocumentFileTypes ?? [])
  const documentStatusTypes = computed(() => data.value?.DocumentStatusTypes ?? [])
  const documentOriginTypes = computed(() => data.value?.DocumentOriginTypes ?? [])
  const personDecisionTypes = computed(() => data.value?.PersonDecisionTypes ?? [])
  const personRightTypes = computed(() => data.value?.PersonRightTypes ?? [])
  const personRoleTypes = computed(() => data.value?.PersonRoleTypes ?? [])

  function syncCacheState(): void {
    const snapshot = cache.getSnapshot()
    data.value = snapshot.data
    isLoading.value = snapshot.isLoading
    error.value = snapshot.error
  }

  async function fetchDictionaries(force = false): Promise<void> {
    const request = cache.load(force)
    syncCacheState()
    await request
    syncCacheState()
  }

  function clearDictionaries(): void {
    cache.clear()
    syncCacheState()
  }

  return {
    data,
    isLoading,
    error,
    isLoaded,
    departments,
    persons,
    documentFileTypes,
    documentStatusTypes,
    documentOriginTypes,
    personDecisionTypes,
    personRightTypes,
    personRoleTypes,
    fetchDictionaries,
    clearDictionaries,
  }
})
