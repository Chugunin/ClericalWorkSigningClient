export interface CreateDocumentRequestData {
    Name: string;
    CreatedDate?: string;
    Description?: string;
    StatusId?: number;
    OriginId?: number;
    Comments?: CreateDocumentCommentPayload[] | [];
    Files?: CreateDocumentFilePayload[] | [];
    Records?: CreateDocumentRecordPayload[] | [];
}

export interface CreateDocumentCommentPayload {
    PersonId: number;
    Content?: string;
    CreatedDate?: string;
}

export interface CreateDocumentFilePayload {
    FileEntryId: string;
    TypeId: number;
}

export interface CreateDocumentRecordPayload {
    PersonId: number;
    RoleId: number;
    DecisionId: number;
}