export interface IAuthCredentials {
    login: string,
    password: string,
}

export interface IAuthResponse {
    status: number;
    statusText: string;
    success: string;
    data: {
        login: string;
        username: string;
        groups: string[];
    };
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}