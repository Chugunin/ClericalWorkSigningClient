import type { Department } from './department.contract'
import type {
    DocumentFileType,
    DocumentOriginType,
    DocumentStatusType,
    PersonDecisionType,
    PersonRightType,
    PersonRoleType,
} from './dictionary-item.contract'
import type { Person } from './person.contract'

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