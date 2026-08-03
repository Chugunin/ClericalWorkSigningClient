import {useAuthStore} from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore()

    // Если есть токен, но профиль еще не загружен (например, после F5)
    // Загружаем профиль ДО того, как отрендерится страница (SSR)
    if (authStore.token && !authStore.user) {
        try {
            await authStore.fetchUser()
        }
        catch {
            authStore.logout()
        }
    }

    const publicRoutes = new Set([
        '/login',
    ])

    // Считаем страницу /login публичной
    const isPublicRoute = publicRoutes.has(to.path)

    // Если нет токена и страница не публичная -> на логин
    if (!authStore.isAuthenticated && !isPublicRoute) {
        return navigateTo('/login')
    }

    // Если авторизован и идет на логин -> на главную
    if (authStore.isAuthenticated && isPublicRoute) {
        return navigateTo('/')
    }
})