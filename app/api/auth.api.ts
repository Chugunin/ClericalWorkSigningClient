import { apiClient } from './api-client'

export const AuthApi = {
    // Типизацию Credentials и User можно будет вынести в shared, если потребуется
    async login(credentials: any): Promise<{ Token: string }> {
        return await $fetch('/api/auth/login', {
            method: 'POST',
            body: credentials
        })
    },

    async getMe(token: string): Promise<any> {
        return await $fetch('/api/auth/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}