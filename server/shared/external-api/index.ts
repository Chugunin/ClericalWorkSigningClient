export {
    requestExternalApi,
    requestExternalFile,
} from './external-api.client'

export type {
    ExternalApiRequestOptions,
    ExternalFileRequestOptions,
} from './external-api.client'

export { resolveAuthorizationHeader } from './authorization-forwarding'
export type { AuthorizationSource } from './authorization-forwarding'

export { describeExternalApiError } from './external-api-error'
export type {
    ExternalApiErrorDescriptor,
} from './external-api-error'