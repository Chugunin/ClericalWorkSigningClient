# Карта модулей и владения кодом

> Статус: утверждённая карта для поэтапной миграции. Любое изменение владельца фиксируется в `MODULAR_ARCHITECTURE_ROADMAP.md`.

## Правило владения

У каждого исходного файла должен быть один целевой владелец. Общий слой используется только для технически универсального кода, который не содержит сценариев конкретной предметной области.

## Целевые модули

| Модуль | Ответственность | Разрешённые зависимости |
|---|---|---|
| `auth` | вход, выход, сессия, текущий пользователь | `shared/api`, `shared/contracts`, `shared/ui` |
| `dictionaries` | загрузка и кеширование справочников | `shared/api`, `shared/contracts` |
| `document-registry` | загрузка, фильтрация, сортировка и отображение списков документов | `dictionaries` только через public API, `shared/*` |
| `document-create` | форма создания, подписанты, файлы формы, преобразование payload | `dictionaries`, `file-viewer` только через public API, `shared/*` |
| `document-control` | экран и сценарий контроля согласования | `document-registry` через public API, `shared/*` |
| `document-signing` | выбор документа, просмотр и подписание PDF, проверка подписей, управление сертификатом | `document-registry`, `file-viewer`, `auth` только через public API; `shared/*` |
| `personal-dashboard` | личная панель, карточки и диаграммы | `document-registry` через public API, `shared/*` |
| `file-viewer` | получение файлов, preview, gallery, освобождение URL | `shared/api`, `shared/contracts`, `shared/ui` |

## Application orchestration

| Исходный файл | Целевой владелец | Примечание |
|---|---|---|
| `app/app.vue` | `app` | корневой composition root |
| `app/app.config.ts` | `app` | глобальная UI-конфигурация |
| `app/middleware/auth.global.ts` | `app/bootstrap` | использует только public API `auth` |
| `app/layouts/default.vue` | `app/layouts` | композиция shared layout и публичных экранов |
| `app/layouts/login-layout.vue` | `app/layouts` | технический layout |
| `app/layouts/documents/create-layout.vue` | `document-create` или тонкий layout-adapter | окончательно проверить при переносе create-модуля |
| `app/pages/**` | route adapters | только metadata, params и публичные экраны модулей |

## Shared infrastructure и UI

| Исходный путь | Целевой путь |
|---|---|
| `app/api/api-client.ts` | `app/shared/api/api-client.ts` |
| `app/composables/api/useApiError.ts` | `app/shared/api/useApiError.ts` |
| `app/composables/api/useLoading.ts` | `app/shared/model/useLoading.ts` |
| `app/composables/ui/useAppToast.ts` | `app/shared/ui/useAppToast.ts` |
| `app/components/ui/AppModal.vue` | `app/shared/ui/AppModal.vue` |
| `app/components/ui/AppDatePicker.vue` | `app/shared/ui/AppDatePicker.vue` |
| `app/components/ui/AppDateRangePicker.vue` | `app/shared/ui/AppDateRangePicker.vue` |
| `app/components/ui/AppTextInput.vue` | `app/shared/ui/AppTextInput.vue` |
| `app/components/layout/**` | `app/shared/layout/**` |
| `app/utils/error.utils.ts` | `app/shared/lib/errors.ts` |
| `app/utils/date.ts` | `app/shared/lib/date.ts` только после отделения domain-specific логики |
| `app/utils/sort.ts` | `app/shared/lib/sort.ts` при подтверждённой универсальности |

## Auth

| Исходный файл | Целевой путь |
|---|---|
| `app/modules/auth/api/auth.api.ts` | `app/modules/auth/api/auth.api.ts` — выполнено |
| `app/modules/auth/model/auth.store.ts` | `app/modules/auth/model/auth.store.ts` — выполнено |
| `app/pages/login.vue` | тонкий adapter к `AuthLoginScreen` — выполнено |
| `shared/types/auth/auth.ts` | `shared/contracts/auth/*` |
| `server/api/auth/**` | `server/modules/auth` + тонкие endpoints |

Особое ограничение: `auth` не загружает справочники. Инициализация справочников принадлежит application bootstrap.

## Dictionaries

| Исходный файл/путь | Целевой путь |
|---|---|
| `app/modules/dictionaries/api/dictionaries.api.ts` | `dictionaries` | перенесено, внутренний API |
| `app/modules/dictionaries/model/dictionaries.store.ts` | `dictionaries` | перенесено, доступ только через public API |
| `shared/types/dictionaries/**` | `shared/contracts/dictionaries/**` либо внутренние types после анализа использования |
| `server/api/dictionaries.get.ts` | `server/modules/dictionaries` + тонкий endpoint |

## Document registry

| Исходный файл/путь | Целевой путь |
|---|---|
| `app/components/documents/list/**` | `app/modules/document-registry/components/**` |
| `app/composables/api/useDocuments.ts` | `app/modules/document-registry/composables/useDocumentRegistry.ts` |
| `app/api/documents.api.ts` | разделить между `document-registry` и `document-create` по операциям |
| `app/utils/document-filters.utils.ts` | `app/modules/document-registry/utils/document-filters.ts` |
| `shared/types/documents/document-filters.ts` | `shared/contracts/documents/document-filters.dto.ts` |
| `shared/types/documents/document*.ts` | DTO в contracts; UI/domain модели внутри модуля |

## Document create

| Исходный файл/путь | Целевой путь |
|---|---|
| `app/components/documents/create/**` | `app/modules/document-create/components/**` |
| `app/composables/documents/create/**` | `app/modules/document-create/composables/**` |
| `app/types/documents/create/**` | `app/modules/document-create/model/**` |
| `shared/types/documents/create-document-request.ts` | `shared/contracts/documents/create-document.request.ts` |
| `app/components/modal/CreateDocumentModal.vue` | кандидат на удаление после доказательства дублирования |

Неоднозначность: две реализации `CreateDocumentModal.vue`. До удаления требуется smoke/component test текущего сценария открытия формы.

## File viewer

| Исходный файл/путь | Целевой путь |
|---|---|
| `app/api/files.api.ts` | `app/modules/file-viewer/api/files.api.ts` |
| `app/composables/api/useFileEntries.ts` | `app/modules/file-viewer/composables/useFileEntries.ts` |
| `app/composables/api/usePhysicalFile.ts` | `app/modules/file-viewer/composables/usePhysicalFile.ts` |
| `app/components/file/**` | `app/modules/file-viewer/components/**` |
| `app/components/ui/FancyBox.vue` | `app/modules/file-viewer/components/FancyBox.vue` |
| `app/components/ui/Gallery.vue` | `app/modules/file-viewer/components/Gallery.vue` |
| `app/utils/file.ts` | разделить на module-local и универсальные функции |
| `shared/types/files/**` | `shared/contracts/files/**` |

## Screen modules

| Исходный путь | Целевой модуль |
|---|---|
| `app/modules/document-control/**` | `document-control` |
| `app/modules/document-signing/**` | `document-signing` — перенесено; legacy path удалён |
| `app/modules/personal-dashboard/components/**` | `personal-dashboard` — перенесено; legacy `private` implementation удалён |
| `app/modules/personal-dashboard/model/**`, `types/**` | `personal-dashboard` — агрегация отделена от визуализации |
| `app/modules/personal-dashboard/model/status-colors.ts` | `personal-dashboard`; глобальный utility удалён |

## Server

| Фактический путь | Владелец |
|---|---|
| `server/shared/external-api/**` | общий transport: base URL, auth forwarding, error/status mapping |
| `server/modules/auth/auth.gateway.ts` | внешний auth API |
| `server/modules/documents/documents.gateway.ts` | получение, фильтрация и создание документов |
| `server/modules/dictionaries/dictionaries.gateway.ts` | агрегация справочников |
| `server/modules/files/files.gateway.ts` | upload и physical-file transport |
| `server/api/auth/**` | тонкие auth endpoints |
| `server/api/documents/**` | тонкие document endpoints |
| `server/api/dictionaries/**` | тонкий dictionaries endpoint |
| `server/api/files/**` | тонкие file endpoints |

**Правила server-слоя:**

- endpoints не содержат URL внешнего API и не вызывают `$fetch`/`fetch` напрямую;
- gateways не импортируют client modules;
- forwarding `Authorization` и cookie выполняется только в `server/shared/external-api`;
- преобразование upstream errors централизовано и сохраняет исходный status;
- shared contracts используются только как сериализуемые DTO.

## Deprecated/duplicate candidates

- `app/components/modal/CreateDocumentModal.vue` — возможный дубликат.
- Legacy application roots удалены; прикладной код размещается только в `app/modules`, `app/shared`, `app/app`, `app/pages`, `app/layouts` и `app/middleware`.

## Порядок миграции

1. shared infrastructure;
2. `auth`;
3. `dictionaries`;
4. `file-viewer`;
5. `document-create`;
6. `document-registry`;
7. screen modules;
8. server modules;
9. удаление compatibility roots — выполнено.


## Фактический статус dictionaries

- Модуль расположен в `app/modules/dictionaries`.
- Public API: `useDictionariesStore` и типы отдельных справочников.
- Внутренние части: `api/dictionaries.api.ts`, `lib/dictionaries-cache.ts`, агрегированный transport DTO.
- Разрешённые зависимости: только `shared/api`, `shared/composables` и shared contracts.
- Все внешние потребители обязаны импортировать `~/modules/dictionaries`.


## Фактический статус file-viewer

- Модуль расположен в `app/modules/file-viewer`.
- Public API: `FileViewer`, `FileInlineViewer`, `FileGallery`, upload capability и file-info helpers.
- Внутренние части: `api/files.api.ts`, `composables/usePhysicalFile.ts`, `model/object-url-resource.ts`.
- API отвечает только за получение `Blob`; lifecycle браузерного object URL принадлежит model-слою модуля.
- Все внешние потребители обязаны импортировать `~/modules/file-viewer`.
- Разрешённые зависимости: `shared/api`, `shared/composables` и shared file contracts.


## document-create

**Владелец:** сценарий создания документа.

**Расположение:** `app/modules/document-create`.

**Публичный API:** `DocumentCreateScreen`, `DocumentCreateModal`, `DocumentFormModel`.

**Разрешённые зависимости:** `dictionaries`, `file-viewer`, `shared`.

**Внутренние детали:** API создания, mapper UI→DTO, validation, submit orchestration и управление файлами формы.


## Фактический статус document-registry

- Модуль расположен в `app/modules/document-registry`.
- Public API: `DocumentsTable`, `DocumentsFilters`, `useDocuments`, `Document`, `DocumentFilters`.
- Внутренние детали: transport API, filter predicate, local filter factory.
- Текущие потребители: будущие `document-control` и `personal-dashboard` через public API.
- Пагинация и сортировка пока принадлежат экранным сценариям; общий контракт не вводится без подтверждённого повторного поведения.


## Фактический статус document-signing

- Модуль расположен в `app/modules/document-signing`.
- Public API: только `DocumentSigningScreen`.
- Внутренние обязанности: выбор документа, PDF preview, геометрия штампа, browser API, проверка подписи и сертификаты.
- Разрешённые зависимости: `document-registry`, `file-viewer`, `auth` только через public API, а также `shared`.
- Server owner: `server/modules/document-signing/document-signing.gateway.ts`; endpoints остаются тонкими BFF adapters.
- Статические GUID и legacy viewer удалены на Stage 20.10.
- Сохранение подписанной версии и переход статуса не реализуются без подтверждённого backend-контракта.


## Реализованный модуль `document-control`

- Корень: `app/modules/document-control`.
- Public API: `DocumentControlScreen`.
- Внутренние обязанности: orchestration экрана, состояние панели фильтров, reset и client-side pagination model.
- Разрешённые зависимости: `document-registry`, `dictionaries`, `shared`.
- Route consumer: `app/pages/documents/control.vue` только через public API.
