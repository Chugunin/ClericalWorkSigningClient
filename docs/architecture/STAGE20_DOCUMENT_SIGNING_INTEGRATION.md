## Stage 20.0 — Toolchain and Lint Baseline

Статус: В работе

Цель:

- восстановить ESLint flat config;
- подключить `@nuxt/eslint`;
- устранить существующие lint errors;
- зафиксировать чистый baseline перед развитием `document-signing`.

Критерии завершения:

- `npm run lint` проходит без ошибок;
- предупреждения либо устранены, либо отдельно зафиксированы;
- правила ESLint не отключены глобально;
- поведение приложения не изменено.

# Stage 20 — Document Signing Integration

**Project:** ClericalWorkSigningClient  
**Baseline:** `ClericalWorkSigningClient(2).zip`  
**Status:** In progress  
**Started:** 2026-08-03

## 1. Goal

Integrate the existing static electronic-signature prototype into the current `document-signing` module without breaking the modular architecture established during the previous 19 stages and the subsequent refactoring cycle.

The resulting module must support:

- viewing a PDF document;
- selecting a page;
- positioning and resizing the visible signature stamp;
- converting browser coordinates to PDF coordinates;
- sending a PDF for signing;
- downloading the signed result;
- verifying signatures in a PDF;
- viewing, issuing and revoking the current user's certificate;
- later replacing local file upload with files belonging to the selected document.

## 2. Current baseline audit

The current module contains:

```text
app/modules/document-signing/
├── components/
│   ├── DocumentSigningListSection.vue
│   ├── DocumentSigningMainSection.vue
│   ├── DocumentSigningScreen.vue
│   └── DocumentSigningViewerSection.vue
├── model/
│   └── signing-selection.ts
└── index.ts
```

Current characteristics:

- route `app/pages/documents/signing.vue` is already a thin adapter;
- module public API exposes only `DocumentSigningScreen`;
- the screen uses `AppThreePaneShell`;
- the left section contains date-range and sorting controls but no document data source yet;
- the main section is empty;
- the viewer section contains temporary static file identifiers;
- the module uses `file-viewer` only through its public API;
- architecture tests already protect module boundaries;
- `pdfjs-dist` is not currently present in project dependencies.

## 3. Architectural rules

The integration must preserve the current project rules:

1. Components must not call the external API directly.
2. Browser requests go through the module API client and Nuxt server routes.
3. External API access belongs to `server/modules/document-signing`.
4. Serialized browser/server/API DTOs belong to `shared/contracts/document-signing`.
5. Authentication tokens remain owned by the existing auth infrastructure.
6. No separate login form or token state is allowed inside `document-signing`.
7. Other feature modules may be used only through their public `index.ts` API.
8. Internal module components, composables and models are not exported unless another module has a justified dependency.
9. Each atomic stage must leave architecture tests passing.
10. Existing behavior is preserved unless the backend contract requires an explicit change.

## 4. Stage roadmap

### Stage 20.1 — Contracts and API boundary

**Status:** In progress

Scope:

- add signing, verification and certificate DTOs;
- define one stable client-facing API contract;
- add contract tests;
- do not change UI behavior yet.

Acceptance criteria:

- contracts contain no Vue/Nuxt imports;
- DTO names reflect request/response direction;
- no barrel file is added under `shared/contracts`;
- `npm run test:document-signing` passes;
- `npm run test:contracts-dto` passes.

### Stage 20.2 — Nuxt server gateway

**Status:** Planned

Scope:

- add `server/modules/document-signing/document-signing.gateway.ts`;
- add Nuxt server routes for sign, verify and certificate operations;
- forward existing authorization through the shared external API client;
- normalize external API errors.

### Stage 20.3 — Browser API client

**Status:** Planned

Scope:

- add module-local browser API client;
- unwrap `ApiResponse<T>` consistently;
- support binary signed-PDF responses;
- keep endpoints out of Vue components.

### Stage 20.4 — PDF preview composable

**Status:** Planned

Scope:

- add lazy client-only loading of `pdfjs-dist`;
- load a local PDF file;
- render a selected page;
- expose page count, current page, viewport and loading/error state;
- clean up render tasks and object resources.

### Stage 20.5 — Signature stamp model

**Status:** Planned

Scope:

- add stamp dimensions and position state;
- constrain movement to page bounds;
- convert DOM coordinates to PDF coordinates;
- cover coordinate conversion with unit tests.

### Stage 20.6 — Signing workspace UI

**Status:** Planned

Scope:

- implement the signing tab in `DocumentSigningMainSection.vue`;
- use Nuxt UI components and project styling;
- add file selection, page controls, stamp controls and signing action;
- download the signed PDF returned by the API.

### Stage 20.7 — Signature verification UI

**Status:** Planned

Scope:

- add verification tab;
- upload a PDF for validation;
- display overall validity and individual signature details;
- safely render backend-provided values without `innerHTML`.

### Stage 20.8 — Certificate management UI

**Status:** Planned

Scope:

- add current-certificate tab;
- support missing-certificate state;
- issue a certificate using the authenticated user context;
- revoke a certificate with an explicit reason.

### Stage 20.9 — Document registry integration

**Status:** Planned

Scope:

- replace temporary static document/file data;
- load documents awaiting signing;
- connect selected document files to the signing workspace;
- determine how the signed binary is persisted in the document domain.

This stage depends on the real external API contract for document signing and file persistence.

### Stage 20.10 — Stabilization and documentation

**Status:** Planned

Scope:

- remove obsolete static viewer code;
- add architecture and behavior tests;
- run typecheck, lint and build;
- update module map and development documentation;
- record final deviations from the original static prototype.

## 5. Progress journal

### 2026-08-03 — Baseline accepted

- `ClericalWorkSigningClient(2).zip` accepted as the current codebase.
- Existing `document-signing` structure inspected.
- Existing module boundary tests inspected.
- Original static prototype decomposed into three capabilities: signing, verification and certificate management.
- Decision: continue as Stage 20, because this project had 19 stages before the refactoring cycle.
- Decision: changes will be delivered as text patches and manual integration instructions, not archives.

### 2026-08-03 — Stage 20.1 started

Planned first change set:

- create `shared/contracts/document-signing`;
- add request/response contracts;
- add contract-boundary tests;
- leave UI and runtime behavior unchanged.

## 6. Validation commands

Run after every atomic stage:

```bash
npm run test:document-signing
npm run test:contracts-dto
npm run test:server-api
npm run test:architecture
npm run typecheck
npm run lint
```

Run the complete gate at major checkpoints:

```bash
npm run check
```

## 7. Open backend questions

These questions do not block Stage 20.1, but must be resolved before runtime integration:

1. Exact external API routes and response envelopes for signing, verification and certificates.
2. Whether signing returns raw `application/pdf` or an API wrapper containing file metadata.
3. Whether page numbering is zero-based or one-based.
4. Expected coordinate units and PDF origin.
5. Whether the visible stamp is mandatory or optional.
6. Whether the signed PDF replaces an existing file or creates a new file entry.
7. Whether certificate creation parameters should be user-entered or backend-derived.
