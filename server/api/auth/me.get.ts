export default defineEventHandler(async (event) => {
    
    // externalApi сам подхватит куку auth_token и передаст в .NET
    return await externalApi(event, '/api/auth/me')
})