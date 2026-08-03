import {
    LoginRequest,
    LoginResponse,
    CurrentUser
} from '#shared/types'

import { apiClient } from './api-client'

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