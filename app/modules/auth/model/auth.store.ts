import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { navigateTo, useCookie } from '#app'

import { AuthApi } from '../api/auth.api'
import { authenticateSession, restoreAuthenticatedSession } from './auth-session'
import type { CurrentUser, LoginRequest } from '#shared/contracts/auth/auth.contracts'

export const useAuthStore = defineStore('auth', () => {

    const tokenCookie = useCookie<string | null>('auth_token')

    const user = ref<CurrentUser | null>(null)
    const loading = ref(false)

    const token = ref<string | null>(
        tokenCookie.value ?? null,
    )

    const isAuthenticated = computed(() => Boolean(token.value && user.value))

    async function login(
        credentials: LoginRequest,
    ) {

        loading.value = true

        try {
            const session = await authenticateSession({
                login: AuthApi.login,
                getCurrentUser: AuthApi.getMe,
            }, credentials)

            token.value = session.token
            tokenCookie.value = session.token
            user.value = session.user
        }
        finally {
            loading.value = false
        }

    }

    async function fetchUser() {

        if (!token.value)
            return

        try {

            const session = await restoreAuthenticatedSession({
                login: AuthApi.login,
                getCurrentUser: AuthApi.getMe,
            }, token.value)

            user.value = session.user

        }
        catch {

            logout()

        }

    }

    function logout() {

        user.value = null

        token.value = null

        tokenCookie.value = null

        navigateTo('/login')

    }

    return {

        user,

        token,

        loading,

        isAuthenticated,

        login,

        fetchUser,

        logout,

    }

})