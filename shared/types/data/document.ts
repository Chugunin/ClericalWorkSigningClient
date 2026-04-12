import type {DocumentComment} from '#shared/types/data/document-comment'
import type {DocumentFile} from '#shared/types/data/document-file'
import type {DocumentRecord} from '#shared/types/data/document-record'

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
