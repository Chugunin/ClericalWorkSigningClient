export interface DictionaryItem {
    Id: number
    Name: string
    Description?: string
}

// Алиасы для однотипных справочников
export type DocumentFileType = DictionaryItem
export type DocumentStatusType = DictionaryItem
export type DocumentOriginType = DictionaryItem
export type PersonRoleType = DictionaryItem
export type PersonDecisionType = DictionaryItem
export type PersonRightType = DictionaryItem
export type FileEntryStatusType = DictionaryItem