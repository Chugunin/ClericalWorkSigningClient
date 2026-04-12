import type { SigningDepartment } from './signing-department'
import type { SigningDocumentFileType } from './signing-document-file-type'
import type { SigningDocumentOriginType } from './signing-document-origin-type'
import type { SigningDocumentStatusType } from './signing-document-status-type'
import type { SigningPerson } from './signing-person'
import type { SigningPersonDecisionType } from './signing-person-decision-type'
import type { SigningPersonRightType } from './signing-person-right-type'
import type { SigningPersonRoleType } from './signing-person-role-type'

export interface DictionariesResponse {
    SigningDocumentFileTypes: SigningDocumentFileType[]
    SigningDocumentStatusTypes: SigningDocumentStatusType[]
    SigningDepartments: SigningDepartment[]
    SigningPersons: SigningPerson[]
    SigningPersonDecisionTypes: SigningPersonDecisionType[]
    SigningPersonRightTypes: SigningPersonRightType[]
    SigningPersonRoleTypes: SigningPersonRoleType[]
    SigningDocumentOriginTypes: SigningDocumentOriginType[]
}