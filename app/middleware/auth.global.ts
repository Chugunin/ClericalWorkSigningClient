import { useApplicationBootstrap } from '~/app/bootstrap'
import { useAuthStore } from '~/modules/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const bootstrap = useApplicationBootstrap()

  if (authStore.token && !authStore.user) {
    try {
      await bootstrap.initialize()
    }
    catch {
      await bootstrap.logout()
    }
  }

  const publicRoutes = new Set(['/login'])
  const isPublicRoute = publicRoutes.has(to.path)

  if (!authStore.isAuthenticated && !isPublicRoute)
    return navigateTo('/login')

  if (authStore.isAuthenticated && isPublicRoute)
    return navigateTo('/')
})
