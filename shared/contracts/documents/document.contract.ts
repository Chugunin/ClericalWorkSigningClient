import type { DocumentComment } from './document-comment.contract'
import type { DocumentFile } from './document-file.contract'
import type { DocumentRecord } from './document-record.contract'

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
