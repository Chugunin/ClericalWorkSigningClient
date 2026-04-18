import type {DocumentComment} from '#shared/types/contracts/responses/documents/document-comment'
import type {DocumentFile} from '#shared/types/contracts/responses/documents/document-file'
import type {DocumentRecord} from '#shared/types/contracts/responses/documents/document-record'

export interface Document {
    Id?: string;
    Name: string;
    Description?: string;
    Version?: number;
    CreatedDate?: string;
    UpdatedDate?: string;
    StatusId?: number;
    OriginId?: number;
    ExecutorId?: number;
    Comments?: DocumentComment[] | [];
    Files?: DocumentFile[] | [];
    Records?: DocumentRecord[] | [];
}
