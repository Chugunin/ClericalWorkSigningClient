export interface LoginRequest {
    login: string
    password: string
}

export interface LoginResponse {
    Token: string
}

export interface CurrentUser {
    Id: number
    Login: string
    FullName: string
    Roles: string[]
}