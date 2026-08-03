import { apiClient } from './api-client'

export interface LoginRequest {
    login: string
    password: string
}

export interface LoginResponse {
    token: string
}

export interface CurrentUser {
    id: string
    login: string
    fullName: string
    roles: string[]
}

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

    async getMe(): Promise<CurrentUser> {

        return await apiClient<CurrentUser>(
            '/api/auth/me'
        )
    }

}