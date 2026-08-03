# Shared layer

`app/shared` contains framework-level building blocks that are independent of business modules.

Allowed contents:

- `api` — common HTTP transport and transport errors;
- `composables` — generic loading, error presentation and application notifications;
- `ui` — reusable controls without document/auth/file business rules;
- `layout` — reusable application shells;
- `lib` — generic date, error and sorting helpers.

Rules:

1. `app/shared` must never import `app/modules`.
2. Business-specific helpers stay with their owning module.
3. External consumers import through the nearest `index.ts` public entry point.
4. Shared DTO contracts remain under root `shared/` because they are used by both client and server.
