import type { LoginRequest, LoginResponse, CurrentUser } from '#shared/contracts/auth/auth.contracts'

import { apiClient } from '~/shared/api'

export const AuthApi = {

    async login(
        credentials: LoginRequest
    ): Promise<LoginResponse> {

        return await apiClient<LoginResponse>(
            '/api/auth/login',
            {
                method: 'POST',
                body: credentials
            }
        )
    },

    async getMe(
        token: string
    ): Promise<CurrentUser> {

        return await apiClient<CurrentUser>(
            '/api/auth/me',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

}