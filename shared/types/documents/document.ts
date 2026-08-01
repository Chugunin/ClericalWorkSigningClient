import type { DocumentComment } from './document-comment'
import type { DocumentFile } from './document-file'
import type { DocumentRecord } from './document-record'

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
