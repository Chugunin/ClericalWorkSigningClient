export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event);

    if (event.method === "POST") {
        const headers = getHeaders(event);
        const body = await readBody(event);

        const { refreshToken } = body;

        const authHeader = headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const accessToken = authHeader.substring(7);
            try {
                const response: any = await $fetch(`${config.authServiceURL}/logout`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    method: "POST",
                    body: {
                        refreshToken: refreshToken,
                    }
                })

                if (response.status === 200 || response.status === 401) {
                    return {
                        status: 200,
                        statusText: "Unauthorized",
                    }
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            return {
                success: false,
                status: 401,
                statusText: 'Unauthorized',
            }
        }
    }
})
