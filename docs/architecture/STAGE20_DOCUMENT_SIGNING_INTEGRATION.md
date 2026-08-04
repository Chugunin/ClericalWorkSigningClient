# Stage 20 — Document Signing Integration

**Project:** ClericalWorkSigningClient  
**Final artifact:** `ClericalWorkSigningClient-stage20-final.zip`  
**Cycle:** continuation after Stages 1–19 and the completed modular refactoring  
**Status:** Completed  
**Started:** 2026-08-03  
**Completed:** 2026-08-03

---

## 1. Purpose

Integrate the electronic PDF-signing prototype into the existing
`document-signing` feature while preserving the modular architecture of the
current project.

The target capability includes:

- PDF preview;
- page navigation;
- visible signature-stamp positioning and resizing;
- conversion from browser coordinates to PDF coordinates;
- sending a PDF for signing;
- receiving and downloading the signed PDF;
- verification of PDF signatures;
- viewing, issuing and revoking a signing certificate;
- later replacement of local file upload with files of a selected document.

The original prototype is treated as a behavioral reference only. Its separate
login form, direct `fetch` calls, global mutable state and standalone CSS are not
copied into the modular application.

---

## 2. Mandatory architecture rules

1. Vue components must not call the external signing API directly.
2. Browser requests must go through a module-local client and Nuxt BFF routes.
3. External API access belongs to `server/modules/document-signing`.
4. Shared transport DTOs belong to `shared/contracts/document-signing`.
5. Authentication remains owned by the existing auth infrastructure.
6. `document-signing` must not store its own access token or render a login form.
7. Feature-to-feature access is allowed only through another module's public API.
8. Internal components, composables and models remain private by default.
9. JSON BFF routes use the common `ApiResponse<T>` envelope.
10. Binary PDF responses are returned without a JSON envelope.
11. Runtime payloads are validated at the server boundary.
12. Every atomic sub-stage must leave architecture checks passing.

Dependency direction:

```text
app/pages
  → app/modules/document-signing public API
    → module components/composables/client API
      → Nuxt /api routes
        → server/modules/document-signing gateway
          → server/shared/external-api
            → external Signing API
```

---

## 3. Baseline audit

The feature existed before Stage 20 with this structure:

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

Confirmed baseline properties:

- `app/pages/documents/signing.vue` is a thin route adapter;
- the public API exposes the feature screen only;
- the screen already uses `AppThreePaneShell`;
- the module has no dependency on `document-control`;
- `file-viewer` is accessed through its public API;
- temporary file identifiers still exist in the viewer section;
- the signing workspace itself is not yet implemented;
- no browser API client for signing exists yet;
- no PDF.js integration exists yet.

---

## 4. Completed work

### Stage 20.0 — Toolchain and lint baseline

**Status:** Completed

Implemented:

- added `eslint.config.mjs` using Nuxt-generated flat configuration;
- connected `@nuxt/eslint` in `nuxt.config.ts`;
- generated `.nuxt/eslint.config.mjs` through `nuxt prepare`;
- removed all current lint errors and warnings;
- replaced unsafe `catch (error: any)` handling in `app/shared/api/api-client.ts`
  with `unknown` and runtime narrowing;
- restored the mandatory global architecture roadmap document;
- retained strict ESLint rules rather than disabling them.

Validated by the user:

```text
npm run lint
→ 0 errors, 0 warnings
```

### Stage 20.1 — Contracts and API boundary

**Status:** Completed

Added:

```text
shared/contracts/document-signing/
├── certificate.contracts.ts
├── pdf-signing.contracts.ts
└── pdf-verification.contracts.ts
```

Contracts cover:

- PDF stamp placement in PDF points;
- sign-request metadata;
- optional signed-file metadata;
- verification result and individual signatures;
- active certificate information;
- certificate issue request;
- certificate revoke request.

Architectural decisions:

- browser types such as `File`, `Blob`, `FormData` and Vue refs are excluded
  from shared transport contracts;
- the binary file is added to `FormData` only in runtime infrastructure;
- `documentId` and `fileEntryId` remain optional future integration fields;
- no barrel file was added under the contract directory.

Added tests:

```text
tests/document-signing/document-signing-contracts.test.mjs
```

The contract test was corrected to ignore documentation comments before
checking forbidden runtime types, avoiding a false positive caused by the word
`FormData` in JSDoc.

Validated by the user:

```text
npm run test:document-signing
→ 14 tests, 14 passed
```

### Stage 20.2 — Nuxt server gateway

**Status:** Completed

Added gateway:

```text
server/modules/document-signing/document-signing.gateway.ts
```

The gateway owns all external signing endpoints:

```text
POST /api/pdf/sign
POST /api/pdf/verify
GET  /api/certificates/current
POST /api/certificates/create
POST /api/certificates/{certificateId}/revoke
```

Added shared multipart reconstruction helper:

```text
server/shared/http/multipart-form-data.ts
```

It:

- requires a multipart body;
- preserves text-field names and values;
- reconstructs uploaded files as `Blob` values;
- preserves filename and content type;
- is reused by signing and verification routes.

Added Nuxt BFF routes:

```text
server/api/pdf/sign.post.ts
server/api/pdf/verify.post.ts
server/api/certificates/current.get.ts
server/api/certificates/create.post.ts
server/api/certificates/[certificateId]/revoke.post.ts
```

Route behavior:

- signing validates the `file` part and returns raw `application/pdf`;
- verification validates the `file` part and returns `ApiResponse<VerifyPdfResponse>`;
- certificate issue and revoke requests are validated at runtime;
- certificate JSON routes use the common `ApiResponse<T>` envelope;
- routes do not call `$fetch` or external endpoints directly;
- authorization forwarding and external error normalization are delegated to
  `server/shared/external-api`;
- the external base URL remains private in `runtimeConfig.signingApi` and is
  configured through `NUXT_SIGNING_API`.

Added and extended tests:

```text
tests/server-api/document-signing-routes.test.mjs
tests/server-api/server-api-boundary.test.mjs
docs/architecture/MODULE_MAP.md
README.md
tests/documentation/documentation.test.mjs
```

The server boundary test now includes all Stage 20.2 routes and the new gateway.

Validated in the prepared archive:

```text
npm run test:document-signing  → 14 passed
npm run test:contracts-dto     → 4 passed
npm run test:server-api        → 13 passed
npm run test:documentation     → 4 passed
npm run check:architecture     → passed; 132 files and 8 modules scanned
```

---

## 5. Remaining roadmap

### Stage 20.3 — Browser API client

**Status:** Completed

Added:

```text
app/modules/document-signing/api/document-signing.api.ts
tests/document-signing/document-signing-api.test.mjs
```

The module-local client now provides:

- `signPdf(file, request): Promise<Blob>`;
- `verifyPdf(file): Promise<VerifyPdfResponse>`;
- `getCurrentCertificate(): Promise<SigningCertificate>`;
- `createCertificate(request): Promise<SigningCertificate>`;
- `revokeCertificate(certificateId, request): Promise<void>`.

Architectural decisions:

- all Nuxt BFF endpoint strings are owned by the module-local API file;
- JSON operations reuse the shared `apiClient`;
- the binary signing response uses `$fetch` only inside the API layer with
  `responseType: 'blob'`;
- `FormData` is assembled only at the browser runtime boundary;
- signing coordinates come from the shared serializable contract;
- binary-request errors are normalized to the existing shared `ApiError`;
- external API base URLs and runtime configuration are not visible to the
  browser client;
- Vue components still contain no direct `$fetch`, `fetch` or endpoint strings.

Added contract-style tests for endpoint ownership, multipart construction, Blob
response handling, shared client reuse and component transport isolation.

### Stage 20.4 — PDF preview composable

**Status:** Completed

Added:

```text
app/modules/document-signing/composables/usePdfPreview.ts
tests/document-signing/pdf-preview-composable.test.mjs
```

Added `pdfjs-dist` as a production dependency.

The private module composable now provides:

- client-only lazy loading of PDF.js;
- PDF worker configuration without a public CDN;
- loading a browser `File` into a `PDFDocumentProxy`;
- rendering a selected page into a supplied canvas;
- page count and current-page state;
- previous/next page navigation;
- configurable preview scale and rerendering;
- viewport width, height and scale for later stamp placement;
- explicit loading, rendering and error state;
- cancellation of stale PDF.js render tasks;
- independent load and render operation guards;
- destruction of replaced, abandoned and disposed PDF documents;
- automatic cleanup through `onScopeDispose`.

Architectural decisions:

- the composable remains private and is not exported from the module public API;
- PDF.js is imported dynamically only from the composable;
- no PDF.js objects are placed in shared transport contracts;
- no signing API calls or document-registry behavior were added;
- the existing placeholder UI was intentionally left unchanged for Stage 20.6.

Validated in the prepared archive:

```text
npm run test:document-signing  → 26 passed
npm run test:contracts-dto     → 4 passed
npm run test:server-api        → 13 passed
npm run test:documentation     → 4 passed
node scripts/check-architecture.mjs
                               → passed; 134 files and 8 modules scanned
```

`npm run lint`, `npm run typecheck` and `npm run build` were not executable in
the packaging environment because the source archive does not contain installed
`node_modules`. They must be run after installing the updated dependencies.

### Stage 20.5 — Signature stamp model

**Status:** Completed

Added:

```text
app/modules/document-signing/model/signature-stamp.ts
tests/document-signing/signature-stamp.test.mjs
```

The private pure model now provides:

- the prototype-compatible default stamp size of `180 × 60` PDF points;
- explicit stamp-size, position, viewport and DOM-rectangle types;
- conversion of PDF-point dimensions to rendered DOM dimensions;
- clamping of the top-left DOM position to the rendered page bounds;
- stable handling when the stamp is larger than the rendered page;
- conversion from top-left browser coordinates to bottom-left PDF coordinates;
- one-based page validation and explicit rejection of invalid geometry;
- rounded serializable `PdfSignaturePlacement` output for the signing API.

Coordinate conversion:

```text
pdfX = domX / scale
pdfY = pageHeightInPoints - domY / scale - stampHeightInPoints
```

Architectural decisions:

- geometry is implemented as framework-independent pure TypeScript;
- the model remains private to `document-signing` and is not added to its public API;
- Vue refs, DOM elements and PDF.js objects are not stored in the model;
- the existing shared transport contract is reused only as the conversion result;
- drag event handling remains deferred to the signing workspace UI;
- the model performs no API calls and owns no document-selection behavior.

Validated in the prepared archive:

```text
npm run test:document-signing  → 34 passed
npm run test:contracts-dto     → 4 passed
npm run test:server-api        → 13 passed
npm run test:documentation     → 4 passed
node scripts/check-architecture.mjs
                               → passed; 135 files and 8 modules scanned
```

`npm run lint`, `npm run typecheck` and `npm run build` were not rerun in the
packaging environment because the source archive does not contain installed
`node_modules`. The Stage 20.5 model has no new package dependency.

### Stage 20.6 — Signing workspace UI

**Status:** Completed

Added:

```text
app/modules/document-signing/components/DocumentSigningWorkspace.vue
tests/document-signing/signing-workspace.test.mjs
```

Updated:

```text
app/modules/document-signing/components/DocumentSigningMainSection.vue
app/modules/document-signing/components/DocumentSigningScreen.vue
app/modules/document-signing/components/DocumentSigningListSection.vue
app/modules/document-signing/components/DocumentSigningWorkspace.vue
app/modules/file-viewer/index.ts
app/modules/file-viewer/composables/usePhysicalFile.ts
```

The central signing workspace now provides:

- local PDF selection as the temporary source until registry integration;
- PDF rendering through the private `usePdfPreview` composable;
- current-page and page-count display;
- previous and next page navigation;
- 100%, 125% and 150% preview scales;
- editable signature-stamp width and height in PDF points;
- a visible stamp overlay containing the authenticated user's name and date;
- pointer-based stamp dragging with pointer capture;
- clamping of the stamp to the rendered page bounds;
- live display of page, X, Y, width and height in PDF coordinates;
- signing through `DocumentSigningApi.signPdf`;
- stable `<original>_signed.pdf` download naming;
- explicit loading, rendering, empty and error states;
- Nuxt UI controls and existing design-token classes.

Architectural decisions:

- the workspace imports the auth module only through its public API;
- it does not own credentials or a separate login flow;
- no endpoint string, `$fetch` or direct `fetch` call exists in the component;
- PDF.js access remains isolated in `usePdfPreview`;
- geometry remains isolated in the pure signature-stamp model;
- the workspace remains a private component rendered by the module's main section;
- the existing left document list remains unchanged until Stage 20.9;
- local file selection is intentionally temporary and does not alter document state.

Validated in the prepared archive:

```text
npm run test:document-signing  → 40 passed
npm run test:contracts-dto     → 4 passed
npm run test:server-api        → 13 passed
npm run test:documentation     → 4 passed
node scripts/check-architecture.mjs
                               → passed
```

`npm run lint`, `npm run typecheck` and `npm run build` must be rerun in the
user environment with installed dependencies.

### Stage 20.7 — Signature verification UI

**Status:** Completed

Added:

```text
app/modules/document-signing/components/DocumentSignatureVerification.vue
tests/document-signing/signature-verification-ui.test.mjs
```

Updated:

```text
app/modules/document-signing/components/DocumentSigningMainSection.vue
app/modules/document-signing/components/DocumentSigningScreen.vue
app/modules/document-signing/components/DocumentSigningListSection.vue
app/modules/document-signing/components/DocumentSigningWorkspace.vue
app/modules/file-viewer/index.ts
app/modules/file-viewer/composables/usePhysicalFile.ts
tests/document-signing/document-signing-api.test.mjs
tests/document-signing/signing-workspace.test.mjs
```

The document-signing main section now exposes two local workspaces:

- PDF signing;
- signature verification.

The verification workspace provides:

- local PDF selection with file-type validation;
- verification through `DocumentSigningApi.verifyPdf`;
- explicit loading and transport-error states;
- overall valid/invalid result presentation;
- backend-provided error-message presentation;
- individual signature cards;
- signer and signing-time display;
- document-integrity status;
- certificate-trust status;
- certificate thumbprint display;
- an explicit empty-signature state.

Security and architecture decisions:

- backend values are rendered only through Vue text bindings;
- `v-html`, `innerHTML` and HTML-string construction are not used;
- the component contains no endpoint strings, `$fetch` or direct `fetch` calls;
- transport remains owned by the module-local browser API;
- the component remains private and is not exported from the module public API;
- certificate management remains deferred to Stage 20.8.

Validated in the prepared archive:

```text
npm run test:document-signing  → 44 passed
npm run test:contracts-dto     → 4 passed
npm run test:server-api        → 13 passed
npm run test:documentation     → 4 passed
node scripts/check-architecture.mjs
                               → passed; 137 files and 8 modules scanned
```

`npm run lint`, `npm run typecheck` and `npm run build` must be rerun in the
user environment with installed dependencies.

### Stage 20.8 — Certificate management UI

**Status:** Completed

Implemented:

- added `DocumentSigningCertificate.vue` as a private module component;
- added a third local tab, `Мой сертификат`, to `DocumentSigningMainSection.vue`;
- load the current certificate through `DocumentSigningApi.getCurrentCertificate()`;
- treat HTTP 404 as the normal no-certificate state;
- render subject, status, serial number, thumbprint and validity period through Vue bindings;
- issue a certificate through `DocumentSigningApi.createCertificate()`;
- derive `commonName` from the authenticated user's `FullName` or `Login`;
- allow organization, department and two-letter country code to be reviewed before issuance;
- require a non-empty explicit reason before certificate revocation;
- revoke through `DocumentSigningApi.revokeCertificate()`;
- refresh certificate state after revocation and expose manual refresh;
- keep endpoint strings and transport calls outside Vue components;
- preserve safe output without `v-html` or HTML-string construction;
- normalize `statusCode` in the shared `apiClient` so expected 404 responses retain their status.

Validated in the prepared archive:

```text
npm run test:document-signing  → 49 passed
npm run test:contracts-dto     → 4 passed
npm run test:server-api        → 13 passed
npm run test:documentation     → 4 passed
node scripts/check-architecture.mjs
                               → passed; 138 files and 8 modules scanned
```

`npm run lint`, `npm run typecheck` and `npm run build` must be rerun in the
user environment with installed dependencies.

### Stage 20.9 — Document registry integration

**Status:** Completed for the existing read-side contracts

Implemented:

- replaced the empty left-panel placeholder with documents loaded through the
  public API of `document-registry`;
- added search, date filtering, refresh, sorting and explicit loading/error/empty
  states to the signing list;
- limited selection to documents that have both a document identifier and a
  physical `FileEntryId`;
- added a private provide/inject selection context owned by
  `DocumentSigningScreen`, allowing the left and center panes to coordinate
  without exporting feature-internal state;
- extended the public API of `file-viewer` with `fetchFileBlob()` rather
  than importing its internal API client from `document-signing`;
- load the selected document file from the existing physical-file endpoint and
  convert the Blob to a browser `File` for the existing PDF-preview workflow;
- preserve local PDF upload as an explicit fallback source;
- pass the existing `documentId` and `fileEntryId` in the signing request when
  the source came from the registry;
- cancel stale physical-file requests when the selection changes or the
  workspace is disposed;
- avoid inventing a new endpoint for replacing the source file, creating a new
  version or changing document status.

Known boundary:

- the current backend contracts support reading the document list and physical
  file, but do not define persistence of the returned signed PDF;
- therefore the signed PDF is still downloaded to the browser;
- saving a new version and refreshing the document status remain blocked until
  the backend workflow is specified.

Validated in the prepared archive:

```text
npm run test:document-signing  → 56 passed
npm run check:architecture     → passed; 139 files and 8 modules scanned
```

### Stage 20.10 — Stabilization and documentation

**Status:** Completed

Removed confirmed obsolete code:

```text
app/modules/document-signing/components/DocumentSigningViewerSection.vue
app/modules/document-signing/model/signing-selection.ts
tests/document-signing/signing-selection.test.mjs
```

The removed viewer contained three static physical-file identifiers and was no
longer referenced after the registry integration. Its selection model served
only that obsolete component.

Stabilization work:

- updated document-signing and file-viewer boundary tests to inspect the actual
  registry-backed signing workspace;
- added `stage20-stabilization.test.mjs` to prevent restoration of static GUIDs,
  accidental public-API expansion and invented persistence endpoints;
- documented the final module structure, dependencies, coordinate system,
  server boundary and backend limitations in `DOCUMENT_SIGNING.md`;
- updated `MODULE_MAP.md` with the actual `document-signing` ownership and
  allowed dependencies;
- added the operational signing guide to the root README and mandatory
  documentation test set;
- retained the screen-only public API;
- retained local PDF upload as an explicit fallback rather than a hidden test
  implementation;
- recorded signed-file persistence and document-state transition as backend
  contract follow-up work.

Final focused validation in the prepared artifact:

```text
npm run test:document-signing  → 57 passed
npm run test:file-viewer       → 7 passed
npm run test:contracts-dto     → 4 passed
npm run test:server-api        → 13 passed
npm run test:cleanup           → 4 passed
npm run test:documentation     → 5 passed
npm run check:architecture     → passed; 137 source files and 8 modules
```

Dependency-backed `lint`, `typecheck` and production build must still be run in
an environment with `node_modules` installed.

---

## 6. File change register

### Added during Stage 20

```text
eslint.config.mjs
shared/contracts/document-signing/certificate.contracts.ts
shared/contracts/document-signing/pdf-signing.contracts.ts
shared/contracts/document-signing/pdf-verification.contracts.ts
server/modules/document-signing/document-signing.gateway.ts
server/shared/http/multipart-form-data.ts
server/api/pdf/sign.post.ts
server/api/pdf/verify.post.ts
server/api/certificates/current.get.ts
server/api/certificates/create.post.ts
server/api/certificates/[certificateId]/revoke.post.ts
tests/document-signing/document-signing-contracts.test.mjs
tests/document-signing/document-signing-api.test.mjs
app/modules/document-signing/composables/usePdfPreview.ts
tests/document-signing/pdf-preview-composable.test.mjs
app/modules/document-signing/model/signature-stamp.ts
tests/document-signing/signature-stamp.test.mjs
app/modules/document-signing/components/DocumentSigningWorkspace.vue
tests/document-signing/signing-workspace.test.mjs
app/modules/document-signing/components/DocumentSignatureVerification.vue
tests/document-signing/signature-verification-ui.test.mjs
app/modules/document-signing/components/DocumentSigningCertificate.vue
app/modules/document-signing/composables/useDocumentSigningSelection.ts
tests/document-signing/certificate-management-ui.test.mjs
tests/document-signing/document-registry-integration.test.mjs
tests/document-signing/stage20-stabilization.test.mjs
docs/architecture/DOCUMENT_SIGNING.md
tests/server-api/document-signing-routes.test.mjs
docs/architecture/MODULAR_ARCHITECTURE_ROADMAP.md
docs/architecture/STAGE20_DOCUMENT_SIGNING_INTEGRATION.md
```

### Updated during Stage 20

```text
nuxt.config.ts
package.json
app/shared/api/api-client.ts
app/modules/document-signing/components/DocumentSigningMainSection.vue
app/modules/document-signing/components/DocumentSigningScreen.vue
app/modules/document-signing/components/DocumentSigningListSection.vue
app/modules/document-signing/components/DocumentSigningWorkspace.vue
app/modules/file-viewer/index.ts
app/modules/file-viewer/composables/usePhysicalFile.ts
tests/document-signing/document-signing-boundary.test.mjs
tests/server-api/server-api-boundary.test.mjs
docs/architecture/MODULE_MAP.md
README.md
tests/documentation/documentation.test.mjs
```

Additional pre-existing lint violations across the project were corrected by the
user as part of Stage 20.0 without intended behavioral changes.

---

## 7. Removed obsolete files

```text
app/modules/document-signing/components/DocumentSigningViewerSection.vue
app/modules/document-signing/model/signing-selection.ts
tests/document-signing/signing-selection.test.mjs
```

Removal basis:

- no runtime imports remained;
- the component contained static test identifiers;
- the model was referenced only by that component and its isolated test;
- the registry-backed workspace supersedes both files.

---

## 8. Validation matrix

Focused checks for the final Stage 20 artifact:

```bash
npm run test:document-signing
npm run test:contracts-dto
npm run test:server-api
npm run lint
npm run typecheck
npm run check:architecture
```

Run the complete dependency-backed gate locally before merging or deploying Stage 20:

```bash
npm run check
```

The source archive does not contain installed `node_modules`, so `npm run lint`,
`npm run typecheck` and `npm run build` could not be rerun in the packaging
environment. Install the updated dependencies, including `pdfjs-dist`, before running the complete gate. The user had already confirmed a clean lint
run before this stage introduced the new PDF.js dependency.

Expected baseline:

- document-signing tests pass;
- contract tests pass;
- server API tests pass;
- ESLint reports zero errors and zero warnings;
- TypeScript check passes;
- Nuxt production build passes.

---

## 9. External API assumptions still requiring confirmation

The Stage 20.2 gateway currently preserves the routes from the supplied static
prototype. Before functional UI integration, confirm:

1. whether the external API really uses the listed route paths;
2. whether verification and certificate responses are raw DTOs or wrapped;
3. whether signing returns raw `application/pdf`;
4. whether page numbering is one-based;
5. whether coordinates are PDF points with a bottom-left origin;
6. whether the visible stamp is mandatory;
7. whether certificate creation fields are required from the client;
8. whether a signed file replaces the source file or creates a new file entry.

These assumptions are isolated in the gateway and shared contracts, so later
backend corrections should not require rewriting Vue components.

---

## 10. Final outcome

Stage 20 is complete on the frontend side.

Delivered capabilities:

- registry-backed document selection;
- physical PDF loading through `file-viewer` public API;
- local PDF fallback;
- PDF preview and page navigation;
- visible stamp positioning and coordinate conversion;
- PDF signing and browser download;
- signature verification;
- certificate viewing, issue and revoke flows;
- Nuxt BFF gateway and transport contracts;
- architecture, boundary and documentation tests.

Open follow-up is intentionally outside Stage 20: persistence of the signed PDF
and document workflow transition require confirmed backend endpoints and DTOs.
No frontend placeholder for those operations has been introduced.
