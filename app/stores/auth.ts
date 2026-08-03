import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCookie, navigateTo } from '#app'
import { useDictionariesStore } from './dictionaries.store'
import { AuthApi } from '~/api/auth.api'

// Используем Setup Store синтаксис
export const useAuthStore = defineStore('auth', () => {
    // 1. Инициализируем куку ОДИН раз на верхнем уровне, пока контекст Nuxt активен
    const tokenCookie = useCookie<string | null>('auth_token')

    // 2. Реактивное состояние
    const user = ref<any>(null)
    const token = ref<string | null>(tokenCookie.value || null)

    // 3. Действия (Actions)
    async function login(credentials: any) {
        try {
            const response = await AuthApi.login(credentials)
            token.value = response.Token
            // Присваиваем значение напрямую, без повторного вызова useCookie
            tokenCookie.value = response.Token

            await fetchUser()
        } catch (error) {
            throw error
        }
    }

    async function fetchUser() {
        if (!token.value) return

        try {
            const userData = await AuthApi.getMe(token.value)
            user.value = userData

            const dictionariesStore = useDictionariesStore()
            await dictionariesStore.fetchDictionaries()
        } catch (error) {
            // Если токен протух - разлогиниваем
            logout()
        }
    }

    function logout() {
        user.value = null
        token.value = null
        // Стираем куку
        tokenCookie.value = null

        const dictionariesStore = useDictionariesStore()
        dictionariesStore.clearDictionaries()

        navigateTo('/login')
    }

    return {
        user,
        token,
        login,
        fetchUser,
        logout
    }
})