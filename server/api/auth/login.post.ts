export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    // Отправляем логин/пароль в .NET
    return await externalApi(event, '/api/auth/login', {
        method: 'POST',
        body
    }) // Должен вернуть { token: "..." }
})