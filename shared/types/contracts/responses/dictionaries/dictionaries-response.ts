import type { Department } from './department'
import type { DocumentFileType } from './document-file-type'
import type { DocumentOriginType } from './document-origin-type'
import type { DocumentStatusType } from './document-status-type'
import type { Person } from './person'
import type { PersonDecisionType } from './person-decision-type'
import type { PersonRightType } from './person-right-type'
import type { PersonRoleType } from './person-role-type'

export interface DictionariesResponse {
    DocumentFileTypes: DocumentFileType[]
    DocumentStatusTypes: DocumentStatusType[]
    Departments: Department[]
    Persons: Person[]
    PersonDecisionTypes: PersonDecisionType[]
    PersonRightTypes: PersonRightType[]
    PersonRoleTypes: PersonRoleType[]
    DocumentOriginTypes: DocumentOriginType[]
}