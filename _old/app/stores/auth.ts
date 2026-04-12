import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {IUser, User} from "#shared/types/auth/user";
import type {IAuthResponse} from "#shared/types/auth/auth";

export const useAuthStore = defineStore('auth', () => {
    const user: Ref<User> = ref<IUser>({
        login: '',
        username: '',
        groups: [],
        isAuthenticated: false,
        expiresAt: '',
        accessToken: '',
        refreshToken: '',
    })

    // методы
    // авторизация / аутентификация
    const login = async (login: string, password: string): Promise<void> => {
        try {
            const response: IAuthResponse = await $fetch('/api/auth/login', {
                method: 'POST',
                body: {
                    login: login,
                    password: password
                }
            });

            if (response?.success) {
                user.value.login = response.data.login;
                user.value.username = response.data.username;
                user.value.groups = response.data.groups;

                user.value.isAuthenticated = true;

                user.value.expiresAt = response.expiresAt;
                user.value.accessToken = response.accessToken;
                user.value.refreshToken = response.refreshToken;
            }

        } catch (error) {
            throw error;
        }
    }

    // выход из профиля
    const logout = async(): Promise<void> => {
        try {

            const response: any = await $fetch('/api/auth/logout', {
                method: 'POST',
                body: {
                    refreshToken: user.value.refreshToken,
                }
            })

            if (response) {
                user.value.login = '';
                user.value.username = '';
                user.value.groups = [];
                user.value.isAuthenticated = false;
                user.value.expiresAt = '';
                user.value.accessToken = '';
                user.value.refreshToken = '';
            }

        } catch (error) {
            throw error;
        }
    }

    return {
        user,
        login,
        logout,
    }
})
