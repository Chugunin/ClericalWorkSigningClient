import { useNuxtApp } from '#app'

import { useAuthStore } from '~/modules/auth'
import { useDictionariesStore } from '~/modules/dictionaries'

import {
  createApplicationBootstrap,
  type ApplicationBootstrap,
} from './application-bootstrap'

const instances = new WeakMap<object, ApplicationBootstrap>()

export function useApplicationBootstrap(): ApplicationBootstrap {
  const nuxtApp = useNuxtApp()
  const existing = instances.get(nuxtApp)

  if (existing)
    return existing

  const auth = useAuthStore()
  const dictionaries = useDictionariesStore()

  const bootstrap = createApplicationBootstrap({
    hasToken: () => Boolean(auth.token),
    hasUser: () => Boolean(auth.user),
    restoreSession: () => auth.fetchUser(),
    loadStartupData: async () => {
      await dictionaries.fetchDictionaries()

      if (dictionaries.error)
        throw new Error(dictionaries.error)
    },
    clearStartupData: () => dictionaries.clearDictionaries(),
    logoutSession: () => auth.logout(),
  })

  instances.set(nuxtApp, bootstrap)

  return bootstrap
}
