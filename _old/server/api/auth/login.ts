import { IAuthCredentials } from '~~/shared/types/auth/auth';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event);


    if (event.method === "POST") {
        const body: IAuthCredentials = await readBody(event);
        const { login, password } = body;

        // запрос токенов у сервиса авторизации
        const response: any = await $fetch(`${config.authServiceURL}/login`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: {
                login: login,
                password: password,
            }
        })

        if (response) {
            const { accessToken, refreshToken, expiresAt } = response;

            // проверка токенов
            try {
                const decoded = jwt.verify(accessToken, config.apiSecret);
                return {
                    status: 200,
                    statusText: "OK",
                    success: true,
                    data: {
                        login: decoded.sub,
                        username: decoded.name,
                        groups: decoded.groups,
                    },
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expiresAt: expiresAt,
                };
            } catch (error) {
                console.error(error);
                throw createError({
                    status: 401,
                    statusText: 'Unauthorized',
                })
            }
        }
    } else {
        return {
            success: false,
            status: 400,
            statusText: 'Method Not Allowed',
        }
    }
})