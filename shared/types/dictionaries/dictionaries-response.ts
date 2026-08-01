import type { Department } from './department'
import type {
    DocumentFileType,
    DocumentOriginType,
    DocumentStatusType,
    PersonDecisionType,
    PersonRightType,
    PersonRoleType,
} from './dictionary-item'
import type { Person } from './person'

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