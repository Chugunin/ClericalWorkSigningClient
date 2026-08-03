This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: shared/**/*
- Files matching these patterns are excluded: **/.git/**, **/node_modules/**, **/.nuxt/**, **/.output/**, **/dist/**, **/coverage/**, **/bin/**, **/obj/**, **/.idea/**, **/.vscode/**, **/*.png, **/*.jpg, **/*.jpeg, **/*.gif, **/*.svg, **/*.ico, **/*.woff, **/*.woff2, **/*.dll, **/*.exe, **/*.zip, **/package-lock.json, **/pnpm-lock.yaml, **/yarn.lock
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Long base64 data strings (e.g., data:image/png;base64,...) have been truncated to reduce token count

# Directory Structure
```
.repomix/
app/
  api/
  assets/
    css/
  components/
    documents/
      control/
      create/
      list/
      private/
      signing/
    file/
    layout/
    modal/
    ui/
  composables/
    api/
    documents/
      create/
    ui/
  constants/
  layouts/
    documents/
  middleware/
  pages/
    documents/
  services/
  stores/
  types/
    documents/
      create/
      private/
    models/
  utils/
docs/
  architecture/
NotebookLM/
server/
  api/
    auth/
    physical-file/
  utils/
shared/
  types/
    api/
      api-response.ts
    auth/
      auth.ts
    dictionaries/
      department.ts
      dictionaries-response.ts
      dictionary-item.ts
      document-file-type.ts
      document-origin-type.ts
      document-status-type.ts
      file-entry-status-type.ts
      person-decision-type.ts
      person-right-type.ts
      person-role-type.ts
      person.ts
    documents/
      create-document-request.ts
      document-comment.ts
      document-file.ts
      document-filters.ts
      document-record.ts
      document.ts
    files/
      file-entry.ts
    index.ts
```

# Files

## File: shared/types/api/api-response.ts
```typescript
export interface ApiResponse<T> {
    success: boolean
    data: T
    error?: string
}
```

## File: shared/types/auth/auth.ts
```typescript
export interface LoginRequest {
    login: string
    password: string
}

export interface LoginResponse {
    Token: string
}

export interface CurrentUser {
    Id: number
    Login: string
    FullName: string
    Roles: string[]
}
```

## File: shared/types/dictionaries/department.ts
```typescript
export interface Department {
    Id: number;
    Name: string;
    Description?: string;
    ParentId?: number;
}
```

## File: shared/types/dictionaries/dictionaries-response.ts
```typescript
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
```

## File: shared/types/dictionaries/dictionary-item.ts
```typescript
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
```

## File: shared/types/dictionaries/document-file-type.ts
```typescript
export interface DocumentFileType {
    Id: number;
    Name: string;
    Description?: string;
}
```

## File: shared/types/dictionaries/document-origin-type.ts
```typescript
export interface DocumentOriginType {
    Id: number;
    Name: string;
    Description?: string;
}
```

## File: shared/types/dictionaries/document-status-type.ts
```typescript
export interface DocumentStatusType {
    Id: number;
    Name: string;
    Description?: string;
}
```

## File: shared/types/dictionaries/file-entry-status-type.ts
```typescript
export interface FileEntryStatusType {
    Id: number;
    Name: string;
    Description?: string;
}
```

## File: shared/types/dictionaries/person-decision-type.ts
```typescript
export interface PersonDecisionType {
    Id: number;
    Name: string;
    Description?: string;
}
```

## File: shared/types/dictionaries/person-right-type.ts
```typescript
export interface PersonRightType {
    Id: number;
    Name: string;
    Description?: string;
}
```

## File: shared/types/dictionaries/person-role-type.ts
```typescript
export interface PersonRoleType {
    Id: number;
    Name: string;
    Description?: string;
}
```

## File: shared/types/dictionaries/person.ts
```typescript
export interface Person {
    Id: number;
    Name: string;
    Rank?: string;
    Post?: string;
    Login?: string;
    RightId: number;
    DepartmentId: number;
}
```

## File: shared/types/documents/create-document-request.ts
```typescript
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
```

## File: shared/types/documents/document-comment.ts
```typescript
export interface DocumentComment {
    Id?: string;
    DocumentId?: string;
    PersonId: number;
    Content?: string;
    CreatedDate?: string;
    UpdatedDate?: string;
}
```

## File: shared/types/documents/document-file.ts
```typescript
export interface DocumentFile {
    Id?: string;
    DocumentId: string;
    FileEntryId: string;
    TypeId: number;
}
```

## File: shared/types/documents/document-filters.ts
```typescript
export interface DocumentFilters {
    SearchText?: string
    DateSince?: string
    DateTill?: string
    StatusIds?: number[]
    ExecutorIds?: number[]
}
```

## File: shared/types/documents/document-record.ts
```typescript
export interface DocumentRecord {
    Id?: string;
    DocumentId?: string;
    PersonId: number;
    RoleId: number;
    DecisionId: number;
}
```

## File: shared/types/documents/document.ts
```typescript
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
```

## File: shared/types/files/file-entry.ts
```typescript
export interface FileEntry {
    Id?: string;
    Path: string;
    OriginalName?: string;
    Hash?: string;
    MimeType?: string;
    StatusId: number;
}
```

## File: shared/types/index.ts
```typescript
export * from './api/api-response'

export * from './auth/auth'

export * from './dictionaries/department'
export * from './dictionaries/dictionaries-response'
export * from './dictionaries/dictionary-item'
export * from './dictionaries/document-file-type'
export * from './dictionaries/document-origin-type'
export * from './dictionaries/document-status-type'
export * from './dictionaries/file-entry-status-type'
export * from './dictionaries/person'
export * from './dictionaries/person-decision-type'
export * from './dictionaries/person-right-type'
export * from './dictionaries/person-role-type'

export * from './documents/create-document-request'
export * from './documents/document'
export * from './documents/document-comment'
export * from './documents/document-file'
export * from './documents/document-filters'
export * from './documents/document-record'

export * from './files/file-entry'
```
