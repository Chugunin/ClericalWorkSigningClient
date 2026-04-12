export type User = {
    login: string | undefined,
    username: string | undefined,
    groups: string[] | [] | undefined,
    isAuthenticated: boolean,
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}

export interface IUser {
    login: string | undefined,
    username: string | undefined,
    groups: string[] | [] | undefined,
    isAuthenticated: boolean,
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}