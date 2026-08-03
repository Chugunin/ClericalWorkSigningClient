import { defineStore } from 'pinia'
import { ref } from 'vue'
import { navigateTo, useCookie } from '#app'

import { AuthApi } from '~/api/auth.api'
import { useDictionariesStore } from './dictionaries.store'

import type {
    CurrentUser,
    LoginRequest,
} from '#shared/types'

export const useAuthStore = defineStore('auth', () => {

    const tokenCookie = useCookie<string | null>('auth_token')

    const user = ref<CurrentUser | null>(null)

    const token = ref<string | null>(
        tokenCookie.value ?? null,
    )

    async function login(
        credentials: LoginRequest,
    ) {

        const response = await AuthApi.login(credentials)

        token.value = response.Token
        tokenCookie.value = response.Token

        await fetchUser()

    }

    async function fetchUser() {

        if (!token.value)
            return

        try {

            user.value = await AuthApi.getMe(
                token.value,
            )

            const dictionaries =
                useDictionariesStore()

            await dictionaries.fetchDictionaries()

        }
        catch {

            logout()

        }

    }

    function logout() {

        user.value = null

        token.value = null

        tokenCookie.value = null

        useDictionariesStore()
            .clearDictionaries()

        navigateTo('/login')

    }

    return {

        user,

        token,

        login,

        fetchUser,

        logout,

    }

})