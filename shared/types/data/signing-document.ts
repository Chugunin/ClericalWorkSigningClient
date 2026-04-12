import type {SigningDocumentComment} from "#shared/types/data/signing-document-comment";
import type {SigningPerson} from "#shared/types/dictionaries/signing-person";
import type {SigningDocumentFile} from "#shared/types/data/signing-document-file";
import type {SigningDocumentRecord} from "#shared/types/data/signing-document-record";

export interface SigningDocument {
    Id?: string;
    Name: string;
    Description?: string;
    Version?: number;
    CreatedDatetime?: string;
    UpdatedDatetime?: string;
    StatusId?: number;
    OriginId?: number;
    Executor?: SigningPerson;
    Comments?: SigningDocumentComment[] | [];
    Files?: SigningDocumentFile[] | [];
    Records?: SigningDocumentRecord[] | [];
}
