import type { H3Event } from 'h3'
import type { DictionariesResponse } from '#shared/contracts/dictionaries/dictionaries-response.contract'
import type { Department } from '#shared/contracts/dictionaries/department.contract'
import type { Person } from '#shared/contracts/dictionaries/person.contract'
import type {
  DocumentFileType,
  DocumentOriginType,
  DocumentStatusType,
  PersonDecisionType,
  PersonRightType,
  PersonRoleType,
} from '#shared/contracts/dictionaries/dictionary-item.contract'
import { requestExternalApi } from '#server/shared/external-api'

export async function loadDictionaries(event: H3Event): Promise<DictionariesResponse> {
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
    requestExternalApi<DocumentFileType[]>(event, '/api/dictionaries/GetDocumentFileTypes'),
    requestExternalApi<DocumentStatusType[]>(event, '/api/dictionaries/GetDocumentStatusTypes'),
    requestExternalApi<Department[]>(event, '/api/dictionaries/GetDepartments'),
    requestExternalApi<Person[]>(event, '/api/dictionaries/GetPersons'),
    requestExternalApi<PersonDecisionType[]>(event, '/api/dictionaries/GetPersonDecisionTypes'),
    requestExternalApi<PersonRightType[]>(event, '/api/dictionaries/GetPersonRightTypes'),
    requestExternalApi<PersonRoleType[]>(event, '/api/dictionaries/GetPersonRoleTypes'),
    requestExternalApi<DocumentOriginType[]>(event, '/api/dictionaries/GetDocumentOriginTypes'),
  ])

  return {
    DocumentFileTypes: DocumentFileTypes ?? [],
    DocumentStatusTypes: DocumentStatusTypes ?? [],
    Departments: Departments ?? [],
    Persons: Persons ?? [],
    PersonDecisionTypes: PersonDecisionTypes ?? [],
    PersonRightTypes: PersonRightTypes ?? [],
    PersonRoleTypes: PersonRoleTypes ?? [],
    DocumentOriginTypes: DocumentOriginTypes ?? [],
  }
}
