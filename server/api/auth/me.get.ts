import { authGateway } from '#server/modules/auth/auth.gateway'

export default defineEventHandler(event => authGateway.getCurrentUser(event))
