import {externalApi} from '../utils/external-api'
import type {ApiResponse} from '~~/shared/types/api/api-response'
import type {DictionariesResponse} from '~~/shared/types/dictionaries/dictionaries-response'
import type {SigningDepartment} from '~~/shared/types/dictionaries/signing-department'
import type {SigningDocumentFileType} from '~~/shared/types/dictionaries/signing-document-file-type'
import type {SigningDocumentOriginType} from '~~/shared/types/dictionaries/signing-document-origin-type'
import type {SigningDocumentStatusType} from '~~/shared/types/dictionaries/signing-document-status-type'
import type {SigningPerson} from '~~/shared/types/dictionaries/signing-person'
import type {SigningPersonDecisionType} from '~~/shared/types/dictionaries/signing-person-decision-type'
import type {SigningPersonRightType} from '~~/shared/types/dictionaries/signing-person-right-type'
import type {SigningPersonRoleType} from '~~/shared/types/dictionaries/signing-person-role-type'

export default defineEventHandler(async (event): Promise<ApiResponse<DictionariesResponse>> => {
    const [
        SigningDocumentFileTypes,
        SigningDocumentStatusTypes,
        SigningDepartments,
        SigningPersons,
        SigningPersonDecisionTypes,
        SigningPersonRightTypes,
        SigningPersonRoleTypes,
        SigningDocumentOriginTypes,
    ] = await Promise.all([
        externalApi<SigningDocumentFileType[]>(event, '/api/signing/dics/GetSigningDocumentFileTypes'),
        externalApi<SigningDocumentStatusType[]>(event, '/api/signing/dics/GetSigningDocumentStatusTypes'),
        externalApi<SigningDepartment[]>(event, '/api/signing/dics/GetSigningDepartments'),
        externalApi<SigningPerson[]>(event, '/api/signing/dics/GetSigningPersons'),
        externalApi<SigningPersonDecisionType[]>(event, '/api/signing/dics/GetSigningPersonDecisionTypes'),
        externalApi<SigningPersonRightType[]>(event, '/api/signing/dics/GetSigningPersonRightTypes'),
        externalApi<SigningPersonRoleType[]>(event, '/api/signing/dics/GetSigningPersonRoleTypes'),
        externalApi<SigningDocumentOriginType[]>(event, '/api/signing/dics/GetSigningDocumentOriginTypes'),
    ])

    return {
        success: true,
        data: {
            SigningDocumentFileTypes,
            SigningDocumentStatusTypes,
            SigningDepartments,
            SigningPersons,
            SigningPersonDecisionTypes,
            SigningPersonRightTypes,
            SigningPersonRoleTypes,
            SigningDocumentOriginTypes,
        },
    }
})
