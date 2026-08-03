export type ApplicationBootstrapStatus = 'idle' | 'running' | 'ready' | 'degraded' | 'failed'

export interface ApplicationBootstrapDependencies {
  hasToken: () => boolean
  hasUser: () => boolean
  restoreSession: () => Promise<void>
  loadStartupData: () => Promise<void>
  clearStartupData: () => void
  logoutSession: () => void | Promise<void>
}

export interface ApplicationBootstrap {
  initialize: () => Promise<void>
  refreshStartupData: () => Promise<void>
  logout: () => Promise<void>
  getStatus: () => ApplicationBootstrapStatus
  getStartupDataError: () => unknown
}

export function createApplicationBootstrap(
  dependencies: ApplicationBootstrapDependencies,
): ApplicationBootstrap {
  let status: ApplicationBootstrapStatus = 'idle'
  let startupDataError: unknown = null
  let initialization: Promise<void> | null = null

  async function loadStartupDataSafely(): Promise<void> {
    startupDataError = null

    try {
      await dependencies.loadStartupData()
      status = 'ready'
    }
    catch (error) {
      startupDataError = error
      status = 'degraded'
    }
  }

  async function runInitialization(): Promise<void> {
    status = 'running'

    if (dependencies.hasToken() && !dependencies.hasUser()) {
      try {
        await dependencies.restoreSession()
      }
      catch (error) {
        status = 'failed'
        throw error
      }
    }

    if (!dependencies.hasUser()) {
      status = 'ready'
      return
    }

    await loadStartupDataSafely()
  }

  return {
    initialize() {
      if (status === 'ready' || status === 'degraded')
        return Promise.resolve()

      if (!initialization) {
        initialization = runInitialization()
          .finally(() => {
            initialization = null
          })
      }

      return initialization
    },

    async refreshStartupData() {
      if (!dependencies.hasUser())
        return

      status = 'running'
      await loadStartupDataSafely()
    },

    async logout() {
      dependencies.clearStartupData()
      await dependencies.logoutSession()
      startupDataError = null
      status = 'idle'
    },

    getStatus: () => status,
    getStartupDataError: () => startupDataError,
  }
}
