import {defineStore} from 'pinia'
import {useDictionariesStore} from './dictionaries.store' // <-- ДОБАВИТЬ ИМПОРТ
import {AuthApi} from '~/api/auth.api' // <-- Используем API из Шага 2

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: useCookie('auth_token').value || null,
    }),

    actions: {
        async login(credentials: any) {
            try {
                const response = await AuthApi.login(credentials)
                this.token = response.Token
                const cookie = useCookie('auth_token')
                cookie.value = this.token

                await this.fetchUser()
            } catch (error) {
                throw error
            }
        },

        async fetchUser() {
            if (!this.token) return

            try {
                this.user = await AuthApi.getMe(this.token)

                // --> ДОБАВЛЕНО: Загружаем словари сразу после получения профиля пользователя
                const dictionariesStore = useDictionariesStore()
                await dictionariesStore.fetchDictionaries()
                // <-- 

            } catch (error) {
                this.logout()
            }
        },

        logout() {
            this.user = null
            this.token = null
            const cookie = useCookie('auth_token')
            cookie.value = null

            // --> ДОБАВЛЕНО: Очищаем кэш словарей при выходе из системы, 
            // чтобы другой пользователь за этим же ПК их не увидел
            const dictionariesStore = useDictionariesStore()
            dictionariesStore.clearDictionaries()
            // <--

            navigateTo('/login')
        }
    }
})