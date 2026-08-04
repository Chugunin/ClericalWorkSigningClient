# Document Signing Module

## Назначение

Модуль `document-signing` реализует пользовательский сценарий работы с электронной подписью PDF:

- выбор документа из реестра;
- загрузку физического PDF через public API `file-viewer`;
- локальную загрузку PDF как явный резервный сценарий;
- просмотр PDF и навигацию по страницам;
- размещение видимого штампа;
- отправку PDF на подписание;
- проверку существующих подписей;
- просмотр, выпуск и отзыв сертификата.

Route adapter:

```text
app/pages/documents/signing.vue
  → ~/modules/document-signing
  → DocumentSigningScreen
```

## Публичная граница

Публичный API модуля экспортирует только:

```ts
DocumentSigningScreen
```

Компоненты, composables, модели и browser API являются внутренними деталями. Другие модули не должны импортировать:

```text
~/modules/document-signing/components/*
~/modules/document-signing/composables/*
~/modules/document-signing/model/*
~/modules/document-signing/api/*
```

## Клиентская структура

```text
app/modules/document-signing/
├── api/
│   └── document-signing.api.ts
├── components/
│   ├── DocumentSignatureVerification.vue
│   ├── DocumentSigningCertificate.vue
│   ├── DocumentSigningListSection.vue
│   ├── DocumentSigningMainSection.vue
│   ├── DocumentSigningScreen.vue
│   └── DocumentSigningWorkspace.vue
├── composables/
│   ├── useDocumentSigningSelection.ts
│   └── usePdfPreview.ts
├── model/
│   └── signature-stamp.ts
└── index.ts
```

## Зависимости

Разрешённые межмодульные зависимости:

- `document-registry` — только через `~/modules/document-registry`;
- `file-viewer` — только через `~/modules/file-viewer`;
- `auth` — только через `~/modules/auth`;
- `shared` — UI, layout, API errors и contracts.

Направление клиентской зависимости:

```text
DocumentSigningScreen
  → registry selection / local file
  → usePdfPreview + signature-stamp model
  → DocumentSigningApi
  → Nuxt /api
```

## Серверная структура

```text
server/api
  → server/modules/document-signing/document-signing.gateway.ts
  → server/shared/external-api
  → external signing API
```

BFF routes:

```text
POST /api/pdf/sign
POST /api/pdf/verify
GET  /api/certificates/current
POST /api/certificates/create
POST /api/certificates/{certificateId}/revoke
```

JSON routes use the common `ApiResponse<T>` envelope. `POST /api/pdf/sign` returns raw `application/pdf`.

## Координаты штампа

UI stores the stamp position in rendered page coordinates with the origin at the top-left. The signing request uses PDF points with the origin at the bottom-left:

```text
pdfX = domX / scale
pdfY = pageHeightInPoints - domY / scale - stampHeightInPoints
```

Geometry and clamping belong to `model/signature-stamp.ts`; Vue components must not duplicate this calculation.

## Authentication

The module does not own tokens or login UI. Browser calls use the current Nuxt session. The server external API client forwards authorization from the incoming request or the existing auth cookie.

## Current backend boundary

The confirmed frontend flow can:

- read documents;
- read a physical PDF file;
- send a PDF for signing;
- download the signed PDF;
- verify signatures;
- manage certificates.

The current contracts do not define:

- replacement of the source file;
- creation of a signed document version;
- document status transition after signing;
- completion of a signing workflow.

These operations must not be simulated in the frontend. They require explicit backend endpoints and DTOs.

## Validation

Focused checks:

```bash
npm run test:document-signing
npm run test:file-viewer
npm run test:contracts-dto
npm run test:server-api
npm run test:documentation
npm run check:architecture
```

Full gate:

```bash
npm run check
```
