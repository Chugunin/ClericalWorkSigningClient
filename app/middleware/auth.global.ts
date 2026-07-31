import {useAuthStore} from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore()

    // Если есть токен, но профиль еще не загружен (например, после F5)
    // Загружаем профиль ДО того, как отрендерится страница (SSR)
    if (authStore.token && !authStore.user) {
        await authStore.fetchUser()
    }

    // Считаем страницу /login публичной
    const isPublicRoute = to.path === '/login'

    // Если нет токена и страница не публичная -> на логин
    if (!authStore.isAuthenticated && !isPublicRoute) {
        return navigateTo('/login')
    }

    // Если авторизован и идет на логин -> на главную
    if (authStore.isAuthenticated && isPublicRoute) {
        return navigateTo('/')
    }
})