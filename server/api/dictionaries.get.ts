import {externalApi} from '../utils/external-api'
import type {ApiResponse} from '~~/shared/types/api/api-response'
import type {DictionariesResponse} from '#shared/types/contracts/responses/dictionaries/dictionaries-response'
import type {Department} from '#shared/types/contracts/responses/dictionaries/department'
import type {DocumentFileType} from '#shared/types/contracts/responses/dictionaries/document-file-type'
import type {DocumentOriginType} from '#shared/types/contracts/responses/dictionaries/document-origin-type'
import type {DocumentStatusType} from '#shared/types/contracts/responses/dictionaries/document-status-type'
import type {Person} from '#shared/types/contracts/responses/dictionaries/person'
import type {PersonDecisionType} from '#shared/types/contracts/responses/dictionaries/person-decision-type'
import type {PersonRightType} from '#shared/types/contracts/responses/dictionaries/person-right-type'
import type {PersonRoleType} from '#shared/types/contracts/responses/dictionaries/person-role-type'

export default defineEventHandler(async (event): Promise<ApiResponse<DictionariesResponse>> => {
    const [
        DocumentFileTypes,
        DocumentStatusTypes,
        Departments,
        Persons,
        PersonDecisionTypes,
        PersonRightTypes,
        PersonRoleTypes,
        DocumentOriginTypes,
    ] = await Promise.all([
        externalApi<DocumentFileType[]>(event, '/api/dics/GetDocumentFileTypes'),
        externalApi<DocumentStatusType[]>(event, '/api/dics/GetDocumentStatusTypes'),
        externalApi<Department[]>(event, '/api/dics/GetDepartments'),
        externalApi<Person[]>(event, '/api/dics/GetPersons'),
        externalApi<PersonDecisionType[]>(event, '/api/dics/GetPersonDecisionTypes'),
        externalApi<PersonRightType[]>(event, '/api/dics/GetPersonRightTypes'),
        externalApi<PersonRoleType[]>(event, '/api/dics/GetPersonRoleTypes'),
        externalApi<DocumentOriginType[]>(event, '/api/dics/GetDocumentOriginTypes'),
    ])

    return {
        success: true,
        data: {
            DocumentFileTypes: DocumentFileTypes ?? [],
            DocumentStatusTypes: DocumentStatusTypes ?? [],
            Departments: Departments ?? [],
            Persons: Persons ?? [],
            PersonDecisionTypes: PersonDecisionTypes ?? [],
            PersonRightTypes: PersonRightTypes ?? [],
            PersonRoleTypes: PersonRoleTypes ?? [],
            DocumentOriginTypes: DocumentOriginTypes ?? [],
        },
    }
})
