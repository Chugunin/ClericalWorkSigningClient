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
- Only files matching these patterns are included: server/**/*
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
      login.post.ts
      me.get.ts
    physical-file/
      [fileId].get.ts
    dictionaries.get.ts
    documents.get.ts
    documents.post.ts
    file-entries.post.ts
  utils/
    external-api.utils.ts
    external-file-api.utils.ts
shared/
  types/
    api/
    auth/
    dictionaries/
    documents/
    files/
```

# Files

## File: server/api/auth/login.post.ts
```typescript
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    // Отправляем логин/пароль в .NET
    return await externalApi(event, '/api/auth/login', {
        method: 'POST',
        body
    }) // Должен вернуть { token: "..." }
})
```

## File: server/api/auth/me.get.ts
```typescript
export default defineEventHandler(async (event) => {
    
    // externalApi сам подхватит куку auth_token и передаст в .NET
    return await externalApi(event, '/api/auth/me')
})
```

## File: server/api/physical-file/[fileId].get.ts
```typescript
import {externalFileApi} from "#server/utils/external-file-api";

export default defineEventHandler(async (event) => {
    const {fileId} = getRouterParams(event)

    const response = await externalFileApi(
        event,
        `/api/files/GetPhysicalFile/${fileId}`,
    )

    const contentType =
        response.headers.get('content-type') ?? 'application/octet-stream'

    const contentDisposition = response.headers.get('content-disposition')

    setHeader(event, 'content-type', contentType)

    if (contentDisposition) {
        setHeader(event, 'content-disposition', contentDisposition)
    }

    return response.body
})
```

## File: server/api/dictionaries.get.ts
```typescript
import {externalApi} from '../utils/external-api'
import type {ApiResponse} from '~~/shared/types/api/api-response'
import type {DictionariesResponse} from '#shared/types/contracts/responses/dictionaries/dictionaries-response'
import type {Department} from '#shared/types/contracts/responses/dictionaries/department'
import type {DocumentFileType} from '#shared/types/contracts/responses/dictionaries/document-file-type'
import type {DocumentOriginType} from '#shared/types/contracts/responses/dictionaries/document-origin-type'
import type {DocumentStatusType} from '#shared/types/contracts/responses/dictionaries/document-status-type'
import type {Person} from '#shared/types/contracts/responses/dictionaries/person'
import type {PersonDecisionType} from '#shared/types/contracts/responses/dictionaries/person-decision-type'
import type {PersonRightType} from '#shared/types/contracts/responses/dictionaries/person-right-type'
import type {PersonRoleType} from '#shared/types/contracts/responses/dictionaries/person-role-type'

export default defineEventHandler(async (event): Promise<ApiResponse<DictionariesResponse>> => {
    const [
        DocumentFileTypes,
        DocumentStatusTypes,
        Departments,
        Persons,
        PersonDecisionTypes,
        PersonRightTypes,
        PersonRoleTypes,
        DocumentOriginTypes,
    ] = await Promise.all([
        externalApi<DocumentFileType[]>(event, '/api/dictionaries/GetDocumentFileTypes'),
        externalApi<DocumentStatusType[]>(event, '/api/dictionaries/GetDocumentStatusTypes'),
        externalApi<Department[]>(event, '/api/dictionaries/GetDepartments'),
        externalApi<Person[]>(event, '/api/dictionaries/GetPersons'),
        externalApi<PersonDecisionType[]>(event, '/api/dictionaries/GetPersonDecisionTypes'),
        externalApi<PersonRightType[]>(event, '/api/dictionaries/GetPersonRightTypes'),
        externalApi<PersonRoleType[]>(event, '/api/dictionaries/GetPersonRoleTypes'),
        externalApi<DocumentOriginType[]>(event, '/api/dictionaries/GetDocumentOriginTypes'),
    ])

    return {
        success: true,
        data: {
            DocumentFileTypes: DocumentFileTypes ?? [],
            DocumentStatusTypes: DocumentStatusTypes ?? [],
            Departments: Departments ?? [],
            Persons: Persons ?? [],
            PersonDecisionTypes: PersonDecisionTypes ?? [],
            PersonRightTypes: PersonRightTypes ?? [],
            PersonRoleTypes: PersonRoleTypes ?? [],
            DocumentOriginTypes: DocumentOriginTypes ?? [],
        },
    }
})
```

## File: server/api/documents.get.ts
```typescript
import { externalApi } from '../utils/external-api'
import type { ApiResponse } from '~~/shared/types/api/api-response'
import type { Document } from '#shared/types/contracts/responses/documents/document'

export default defineEventHandler(async (event): Promise<ApiResponse<Document[]>> => {
    const documents = await externalApi<Document[]>(
        event,
        '/api/GetDocuments',
    )

    return {
        success: true,
        data: documents ?? [],
    }
})
```

## File: server/api/documents.post.ts
```typescript
import { externalApi } from '../utils/external-api'
import type { ApiResponse } from '~~/shared/types/api/api-response'
import type { Document } from '#shared/types/contracts/responses/documents/document'
import type {DocumentFilters} from '#shared/types/contracts/requests/filters/document-filters'
import type {CreateDocumentRequestData} from "#shared/types/contracts/requests/documents/create-document-request-data";

export default defineEventHandler(async (event): Promise<ApiResponse<Document[] | Document>> => {
    const body = await readBody<{
        action?: 'create' | 'filter'
        document?: Document
        filters?: DocumentFilters | null
    }>(event)

    if (body?.action === 'create') {
        if (!body.document) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Document payload is required',
            })
        }

        const document = await externalApi<Document>(
            event,
            '/api/actions/CreateDocument',
            {
                method: 'POST',
                body: body.document,
            },
        )

        return {
            success: true,
            data: document,
        }
    }

    const documents = await externalApi<Document[]>(
        event,
        '/api/GetDocuments',
        {
            method: 'POST',
            body: body?.filters ?? null,
        },
    )

    return {
        success: true,
        data: documents ?? [],
    }
})
```

## File: server/api/file-entries.post.ts
```typescript
import { externalApi } from '../utils/external-api'
import type { ApiResponse } from '#shared/types/api/api-response'
import type {FileEntry} from "#shared/types/contracts/responses/file-entries/file-entry";

export default defineEventHandler(async (event): Promise<ApiResponse<FileEntry>> => {
    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Multipart form data is required',
        })
    }
    
    const file = formData.find(p => p.name === 'file')
    
    if (!file) {
        throw createError({
            statusCode: 400,
            statusMessage: 'File payload is required',
        })
    }

    const forwardedFormData = new FormData()
    forwardedFormData.append(
        'file',
        new Blob([new Uint8Array(file.data)], { type: file.type || 'application/octet-stream' }),
        file.filename || 'file'
    )

    const fileEntry = await externalApi<FileEntry>(
        event,
        '/api/files/SaveFileEntry',
        {
            method: 'POST',
            body: forwardedFormData,
        },
    )

    return {
        success: true,
        data: fileEntry,
    }
})
```

## File: server/utils/external-api.utils.ts
```typescript
import type {H3Event} from 'h3'
import { getCookie, getHeader } from 'h3'

interface ExternalApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: any
    headers?: Record<string, string>
}

export async function externalApi<T>(
    event: H3Event,
    path: string,
    options: ExternalApiOptions = {},
): Promise<T> {
    
    const config = useRuntimeConfig(event)
    const fetchHeaders = new Headers(options.headers)

    // 1. Проверяем, передал ли клиент токен явно в заголовке (как мы сделали в fetchUser)
    const authHeader = getHeader(event, 'authorization')

    // 2. Проверяем, есть ли токен в сессионной куке (когда работает SSR при обновлении страницы)
    const tokenCookie = getCookie(event, 'auth_token')

    if (authHeader) {
        // Если заголовок есть, он в приоритете (уже содержит слово Bearer)
        fetchHeaders.set('Authorization', authHeader)
    } else if (tokenCookie) {
        // Если заголовка нет, но есть кука, формируем заголовок сами
        fetchHeaders.set('Authorization', `Bearer ${tokenCookie}`)
    }
    
    try {
        const response = await $fetch<T>(path, {
            baseURL: config.signingApi,
            method: options.method ?? 'GET',
            body: options.body,
            headers: Object.fromEntries(fetchHeaders.entries()),
        })

        return response as T
    } catch (error: any) {
        throw createError({
            statusCode: error?.statusCode || 500,
            statusMessage: error?.statusMessage || 'External API request failed',
            message: error?.data?.message || error?.message || 'Unknown error'
        })
    }
}
```

## File: server/utils/external-file-api.utils.ts
```typescript
// server/utils/external-file-api.ts
import type {H3Event} from 'h3'

export async function externalFileApi(
    event: H3Event,
    path: string,
) {
    const config = useRuntimeConfig(event)

    try {
        const response = await fetch(`${config.signingApi}${path}`)
        
        console.log(response)

        if (!response.ok) {
            throw createError({
                statusCode: response.status,
                statusMessage: response.statusText,
            })
        }

        return response
    } catch (error: unknown) {
        throw createError({
            statusCode: 500,
            statusMessage: 'External file request failed',
        })
    }
}
```
