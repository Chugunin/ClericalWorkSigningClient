import type {DocumentComment} from "#shared/types/contracts/responses/documents/document-comment";
import type {DocumentFile} from "#shared/types/contracts/responses/documents/document-file";
import type {DocumentRecord} from "#shared/types/contracts/responses/documents/document-record";

export interface CreateDocumentRequestData {
    Name: string;
    CreatedDate?: string;
    Description?: string;
    StatusId?: number;
    OriginId?: number;
    Comments?: Comment[] | [];
    Files?: File[] | [];
    Records?: Record[] | [];
}

export interface Comment{
    PersonId: number;
    Content?: string;
    CreatedDate?: string;
}

export interface File{
    Path: string;
    TypeId: number;
}

export interface Record{
    PersonId: number;
    RoleId: number;
    DecisionId: number;
}