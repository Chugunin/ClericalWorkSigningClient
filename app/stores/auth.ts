import {defineStore} from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    
    // Сессионная кука (нет maxAge)
    const token = useCookie<string | null>('auth_token')
    const user = ref<any>(null)
    const loading = ref(false)

    const login = async (credentials: any) => {
        try {
            loading.value = true
            
            // Дергаем наш Nuxt-сервер (он пойдет в .NET)
            const res = await $fetch<any>('/api/auth/login', {
                method: 'POST',
                body: credentials
            })

            console.log('Ответ от логина:', res)

            // Сохраняем токен в куку (сразу доступна и клиенту, и серверу)
            token.value = res.Token
            
            if (!res.Token) {
                throw new Error('Токен не найден')
            }

            // Сразу загружаем профиль
            await fetchUser()
            
        } catch (error) {
            console.error('Ошибка входа', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const fetchUser = async () => {
        if (!token.value) return

        try {
            user.value = await $fetch<any>('/api/auth/me', {
                // Явно прикрепляем токен, чтобы не ждать, пока обновится кука в браузере
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            })
        } catch (error) {
            // Если токен протух или невалиден — очищаем всё
            token.value = null
            user.value = null
            throw error
        }
    }

    const logout = () => {
        token.value = null
        user.value = null
        navigateTo('/login')
    }

    // Геттеры
    const isAuthenticated = computed(() => !!token.value)

    return {token, user, loading, isAuthenticated, login, fetchUser, logout}
})