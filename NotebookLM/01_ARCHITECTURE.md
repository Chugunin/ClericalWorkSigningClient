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
- Only files matching these patterns are included: README.md, docs/**/*, package.json, nuxt.config.ts, tsconfig.json
- Files matching these patterns are excluded: **/.git/**, **/node_modules/**, **/.nuxt/**, **/.output/**, **/dist/**, **/coverage/**, **/bin/**, **/obj/**, **/.idea/**, **/.vscode/**, **/*.png, **/*.jpg, **/*.jpeg, **/*.gif, **/*.svg, **/*.ico, **/*.woff, **/*.woff2, **/*.dll, **/*.exe, **/*.zip, **/package-lock.json, **/pnpm-lock.yaml, **/yarn.lock
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Long base64 data strings (e.g., data:image/png;base64,...) have been truncated to reduce token count

# Directory Structure
````
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
    MODULAR_ARCHITECTURE_ROADMAP.md
server/
  api/
    auth/
    physical-file/
  utils/
shared/
  types/
    api/
    auth/
    dictionaries/
    documents/
    files/
nuxt.config.ts
package.json
README.md
tsconfig.json
````

# Files

## File: docs/architecture/MODULAR_ARCHITECTURE_ROADMAP.md
````markdown
# План перехода на модульную архитектуру

> Проект: `ClericalWorkSigningClient`
>
> Статус документа: **активный рабочий план**
>
> Итоговая цель: преобразовать приложение в сопровождаемый модульный монолит, в котором функциональные модули можно независимо развивать, тестировать и заменять без скрытых межмодульных зависимостей и без изменения существующего пользовательского поведения.

---

## 1. Правила ведения плана

Обозначения:

- `[ ]` — не начато;
- `[-]` — выполняется;
- `[x]` — выполнено и подтверждено проверками;
- `[!]` — заблокировано; причина должна быть записана рядом;
- `[~]` — выполнено частично; обязательно указать остаток.

Пункт считается завершённым только когда:

1. изменения внесены в проект;
2. существующее поведение сохранено либо изменение явно согласовано;
3. добавлены или обновлены тесты;
4. пройдены обязательные проверки этапа;
5. в этом документе поставлена отметка `[x]`;
6. в журнале изменений этапа записан фактический результат.

Запрещено отмечать этап выполненным только по факту перемещения файлов.

---

## 2. Неподлежащие нарушению архитектурные правила

### 2.1. Направление зависимостей

Разрешённое направление:

```text
pages / layouts / middleware
            ↓
      application bootstrap
            ↓
          modules
            ↓
 shared UI / shared infrastructure
            ↓
       shared contracts
```

### 2.2. Правила модулей

- Каждый бизнес-модуль владеет своими `components`, `composables`, `model`, `api`, `types`, `utils`, `mappers` и тестами.
- Внутренние файлы одного модуля не импортируются другим модулем напрямую.
- Межмодульный импорт разрешён только через публичный `index.ts` модуля.
- Прямые циклические зависимости между модулями запрещены.
- Модуль не должен обращаться к store другого модуля через внутренний путь.
- Страница маршрута должна оставаться тонким адаптером и не содержать бизнес-логику.
- `shared` не импортирует `modules`.
- В `shared` запрещено размещать предметную логику только ради устранения одного импорта.
- DTO внешнего API отделяются от UI-моделей и состояния форм.
- Server endpoints должны быть тонкими и делегировать работу gateway/service-слою.
- Переезд файлов не должен изменять пользовательское поведение.

### 2.3. Допустимая внутренняя структура модуля

```text
app/modules/<module-name>/
├── api/          # API конкретного модуля
├── components/   # UI модуля
├── composables/  # сценарии и view-model
├── model/        # store и состояние
├── mappers/      # DTO ↔ domain/UI
├── types/        # внутренние типы
├── utils/        # только локальные утилиты
├── tests/        # тесты модуля
└── index.ts      # единственный публичный API
```

Каталоги создаются только при фактической необходимости. Пустые каталоги не добавляются.

---

## 3. Обязательный контур качества

К окончанию миграции команда:

```bash
npm run check
```

должна последовательно запускать:

```text
check:toolchain
check:architecture
test:contracts
test:unit
typecheck
lint
build
```

### 3.1. Обязательные архитектурные проверки

Должны автоматически проверяться следующие ограничения:

- [ ] `shared` не импортирует `modules`;
- [ ] один модуль не импортирует внутренние файлы другого модуля;
- [ ] межмодульный импорт выполняется только через `index.ts`;
- [ ] `pages` не импортируют внутренние файлы модулей;
- [ ] `server` не импортирует код из `app/modules`;
- [ ] shared contracts не импортируют Vue, Nuxt, Pinia и UI-библиотеки;
- [ ] нет циклических зависимостей между модулями;
- [ ] нет конфликтующих публичных экспортов;
- [ ] каждый зарегистрированный модуль имеет `index.ts`;
- [ ] отсутствуют запрещённые compatibility-imports после завершения миграции;
- [ ] отсутствуют дублирующие реализации одного публичного компонента или composable;
- [ ] архитектурный baseline равен нулю: новые нарушения не маскируются allowlist-файлом.

### 3.2. Типы тестов

- **Контрактные тесты** — форма публичного API модуля, DTO, mapper, границы зависимостей.
- **Unit-тесты** — чистые функции, composables, stores, mappers.
- **Component-тесты** — критические UI-компоненты и пользовательские действия.
- **Smoke-тесты маршрутов** — основные страницы импортируются и создаются без ошибок.
- **Регрессионные тесты** — текущее поведение ключевых сценариев.

---

# 4. Дорожная карта

## Stage 0. Фиксация исходного состояния

**Цель:** получить воспроизводимый baseline до архитектурных перемещений.

- [ ] Зафиксировать дерево каталогов и список исходных маршрутов.
- [ ] Зафиксировать список Pinia stores, composables, API-клиентов и server endpoints.
- [ ] Зафиксировать текущие пользовательские сценарии:
  - [ ] вход и восстановление сессии;
  - [ ] загрузка справочников;
  - [ ] список и фильтрация документов;
  - [ ] создание документа;
  - [ ] загрузка и просмотр файлов;
  - [ ] контроль согласования;
  - [ ] согласование документа;
  - [ ] личная страница.
- [ ] Создать таблицу существующих ошибок `docs/architecture/BASELINE_ISSUES.md`.
- [ ] Отделить исходные ошибки от ошибок, появившихся во время миграции.
- [ ] Зафиксировать текущие build-команды и версии Node/npm.

**Критерий завершения:** существует документированный baseline; дальнейшие регрессии можно отличить от исходных дефектов.

**Проверки:** ручной запуск приложения, фиксация результатов `npm install`, `nuxt prepare`, `build`.

---

## Stage 1. Восстановление согласованной сборки

**Цель:** устранить технические блокеры до перемещения архитектуры.

- [ ] Исправить импорты из отсутствующего `#shared/types/contracts`.
- [ ] Исправить импорт отсутствующего `~/utils/filter.utils`.
- [ ] Согласовать имя и импорт `external-file-api.utils.ts`.
- [ ] Найти все неразрешимые импорты и ошибочные alias.
- [ ] Найти конфликтующие Nuxt auto-import имена.
- [ ] Проверить двойную реализацию `CreateDocumentModal.vue` и определить актуальную.
- [ ] Удалить или временно изолировать только доказанно неиспользуемые файлы.
- [ ] Добиться успешного `nuxt prepare`.
- [ ] Добиться успешного `typecheck` после подключения инструмента.
- [ ] Добиться успешного production build.

**Критерий завершения:** проект собирается без архитектурных перемещений; все исходные блокирующие ошибки классифицированы или исправлены.

---

## Stage 2. Настройка toolchain и единой команды проверки

**Цель:** сделать любое архитектурное нарушение автоматически обнаруживаемым.

- [ ] Добавить ESLint для Nuxt 4 и TypeScript.
- [ ] Добавить Vitest.
- [ ] Добавить `@vue/test-utils` и Nuxt test utilities при фактической необходимости.
- [ ] Добавить команды:
  - [ ] `typecheck`;
  - [ ] `lint`;
  - [ ] `test:unit`;
  - [ ] `test:contracts`;
  - [ ] `check:toolchain`;
  - [ ] `check:architecture`;
  - [ ] `check`.
- [ ] Настроить JUnit-отчёт для CI.
- [ ] Настроить отдельный каталог отчётов, исключённый из git.
- [ ] Проверить запуск всех команд на чистой установке зависимостей.
- [ ] Зафиксировать поддерживаемую версию Node в `.nvmrc` или `.node-version` и `package.json#engines`.

**Критерий завершения:** `npm run check` существует и останавливает pipeline при любой ошибке.

---

## Stage 3. Архитектурный тестовый каркас

**Цель:** жёстко закрепить границы до массового перемещения файлов.

- [ ] Создать `tests/architecture/`.
- [ ] Создать реестр модулей или правила их автоматического обнаружения.
- [ ] Добавить тест запрета `shared → modules`.
- [ ] Добавить тест запрета внутренних межмодульных импортов.
- [ ] Добавить тест публичного импорта только через `index.ts`.
- [ ] Добавить тест тонких страниц.
- [ ] Добавить тест server/client boundary.
- [ ] Добавить тест чистоты shared contracts.
- [ ] Добавить обнаружение циклических зависимостей.
- [ ] Добавить проверку конфликтующих `export *`.
- [ ] Добавить проверку запрещённых alias и compatibility roots.
- [ ] Добавить проверку отсутствия orphan public API.
- [ ] Не использовать постоянный baseline исключений; временные исключения должны иметь владельца и этап удаления.

**Критерий завершения:** искусственно добавленное нарушение гарантированно ломает `npm run check:architecture`.

---

## Stage 4. Карта доменов и владения кодом

**Цель:** до перемещения определить единственного владельца каждого файла.

- [ ] Создать `docs/architecture/MODULE_MAP.md`.
- [ ] Для каждого файла определить категорию:
  - [ ] `app` orchestration;
  - [ ] конкретный бизнес-модуль;
  - [ ] shared infrastructure;
  - [ ] shared UI;
  - [ ] shared contract;
  - [ ] server module;
  - [ ] deprecated/duplicate.
- [ ] Зафиксировать целевые модули:
  - [ ] `auth`;
  - [ ] `dictionaries`;
  - [ ] `document-registry`;
  - [ ] `document-create`;
  - [ ] `document-control`;
  - [ ] `document-signing`;
  - [ ] `personal-dashboard`;
  - [ ] `file-viewer`.
- [ ] Зафиксировать разрешённые зависимости каждого модуля.
- [ ] Отдельно перечислить неоднозначные места, где поведение нельзя восстановить из кода.

**Критерий завершения:** каждый перемещаемый файл имеет одного целевого владельца; массовое перемещение вслепую исключено.

---

## Stage 5. Shared infrastructure

**Цель:** выделить только технически универсальные компоненты и сервисы.

- [ ] Создать `app/shared/api`.
- [ ] Перенести общий HTTP-клиент без изменения его поведения.
- [ ] Создать единый тип ошибки API.
- [ ] Создать `app/shared/ui` для действительно универсальных компонентов.
- [ ] Создать `app/shared/layout` для общего каркаса приложения.
- [ ] Создать `app/shared/lib` для универсальных функций.
- [ ] Проверить каждую перемещаемую утилиту минимум на двух независимых потребителях.
- [ ] Вернуть предметные document/file/auth helpers владельцам модулей.
- [ ] Добавить публичные `index.ts` только там, где они уменьшают связанность, а не скрывают её.
- [ ] Добавить unit-тесты общих чистых функций.

**Критерий завершения:** `shared` не содержит бизнес-логики и не зависит от модулей.

---

## Stage 6. Application bootstrap

**Цель:** убрать скрытую оркестрацию между stores и модулями.

- [ ] Создать `app/app/bootstrap/useApplicationBootstrap.ts`.
- [ ] Перенести загрузку общих стартовых данных из auth store.
- [ ] Определить последовательность: восстановление сессии → стартовые данные → запуск маршрута.
- [ ] Обеспечить идемпотентность bootstrap.
- [ ] Добавить обработку частичного отказа справочников без разрушения auth session.
- [ ] Добавить unit/contract-тесты bootstrap.

**Критерий завершения:** auth не знает о dictionaries и других бизнес-модулях.

---

## Stage 7. Модуль `auth`

**Цель:** изолировать управление сессией и входом.

- [ ] Создать `app/modules/auth`.
- [ ] Перенести auth API.
- [ ] Перенести auth store.
- [ ] Перенести форму и экран входа.
- [ ] Перенести auth middleware или предоставить ему публичный API.
- [ ] Определить минимальный публичный API модуля.
- [ ] Запретить экспорт внутренних DTO и private helpers.
- [ ] Добавить тесты login/logout/session restore/error mapping.
- [ ] Сделать страницу login тонким route adapter.

**Критерий завершения:** модуль auth автономен и не импортирует dictionaries/documents/files.

---

## Stage 8. Модуль `dictionaries`

**Цель:** изолировать загрузку и кеширование справочников.

- [ ] Создать `app/modules/dictionaries`.
- [ ] Перенести API и store справочников.
- [ ] Отделить DTO от потребительских моделей.
- [ ] Добавить явные selectors/getters.
- [ ] Исключить прямой доступ других модулей к внутреннему store.
- [ ] Определить политику кеша и повторной загрузки.
- [ ] Добавить тесты single-flight, cache, reset и error state.

**Критерий завершения:** потребители используют только публичный API dictionaries.

---

## Stage 9. Модуль `file-viewer`

**Цель:** объединить работу с файловыми записями и preview в одном владельце.

- [ ] Создать `app/modules/file-viewer`.
- [ ] Перенести file API.
- [ ] Перенести `useFileEntries` и `usePhysicalFile`.
- [ ] Перенести viewer/gallery/inline viewer.
- [ ] Разделить file DTO, preview state и UI components.
- [ ] Гарантировать освобождение object URL.
- [ ] Унифицировать loading/error/unsupported states.
- [ ] Добавить тесты загрузки, ошибок, отмены и очистки ресурсов.

**Критерий завершения:** ни один другой модуль не работает с физическими файлами через внутренние implementation paths.

---

## Stage 10. Модуль `document-create`

**Цель:** сделать сценарий создания документа самодостаточным.

- [ ] Создать `app/modules/document-create`.
- [ ] Перенести компоненты формы.
- [ ] Перенести composables формы, файлов и подписантов.
- [ ] Перенести локальные типы и правила валидации.
- [ ] Создать mapper `form model → CreateDocumentRequest`.
- [ ] Разделить UI model и API DTO.
- [ ] Устранить дублирование `CreateDocumentModal.vue`.
- [ ] Определить один публичный экран/форму и, при необходимости, modal adapter.
- [ ] Добавить тесты mapper, validation, submit, files и signers.
- [ ] Проверить сохранение текущего пользовательского сценария.

**Критерий завершения:** создание документа может развиваться внутри одного модуля без правок глобальных технических каталогов.

---

## Stage 11. Модуль `document-registry`

**Цель:** выделить повторно используемую работу со списками документов.

- [ ] Создать `app/modules/document-registry`.
- [ ] Перенести DocumentsTable.
- [ ] Перенести DocumentsFilters.
- [ ] Разделить API client и view-model списка.
- [ ] Изолировать фильтры, пагинацию, сортировку и выбор.
- [ ] Удалить или исправить устаревшие filter utilities.
- [ ] Определить публичные props/emits/types.
- [ ] Добавить тесты фильтров, pagination/reset, loading/error и row selection.
- [ ] Не включать в registry бизнес-действия signing/control.

**Критерий завершения:** registry предоставляет инфраструктуру списка, но не владеет бизнес-сценариями согласования.

---

## Stage 12. Модуль `document-control`

**Цель:** изолировать сценарий контроля согласования.

- [ ] Создать `app/modules/document-control`.
- [ ] Перенести экран и локальную оркестрацию.
- [ ] Использовать document-registry только через публичный API.
- [ ] Не переносить control-specific код в registry/shared.
- [ ] Декомпозировать экран только по доказанным обязанностям.
- [ ] Добавить smoke и component-тесты ключевых действий.
- [ ] Сделать route page тонким адаптером.

**Критерий завершения:** control не импортирует внутренности registry/signing.

---

## Stage 13. Модуль `document-signing`

**Цель:** изолировать сценарий согласования документа.

- [ ] Создать `app/modules/document-signing`.
- [ ] Перенести signing screen и секции.
- [ ] Выделить composable orchestration текущего документа.
- [ ] Подключить file-viewer через публичный API.
- [ ] Подключить registry через публичный API.
- [ ] Отделить команды согласования от UI.
- [ ] Добавить тесты выбора документа, просмотра и действий согласования.
- [ ] Сделать route page тонким адаптером.

**Критерий завершения:** signing имеет явные зависимости и не содержит прямых импортов чужих stores/components.

---

## Stage 14. Модуль `personal-dashboard`

**Цель:** заменить неясную область `private` понятным предметным модулем.

- [ ] Подтвердить назначение текущего `private` кода по фактическому поведению.
- [ ] Создать `app/modules/personal-dashboard`.
- [ ] Перенести экран, карточки и charts.
- [ ] Отделить агрегацию данных от визуализации.
- [ ] Удалить предметные dashboard-типы из глобальных каталогов.
- [ ] Добавить unit/component-тесты агрегатов и состояний экрана.
- [ ] Сделать route page тонким адаптером.

**Критерий завершения:** название и границы модуля отражают его реальное назначение.

---

## Stage 15. Shared contracts и DTO normalization

**Цель:** создать чёткую границу сериализуемых контрактов между browser и Nuxt server.

- [ ] Создать `shared/contracts`.
- [ ] Перенести только реально передаваемые DTO.
- [ ] Удалить зависимости contracts от Vue/Nuxt/Pinia/UI.
- [ ] Разделить request/response/domain/UI types.
- [ ] Добавить mapper на каждой границе, где модели различаются.
- [ ] Убрать широкий `shared/types/index.ts` или ограничить его безопасными базовыми контрактами.
- [ ] Заменить скрывающие зависимость импорты из общего barrel.
- [ ] Добавить contract-тесты сериализации и обязательных полей.

**Критерий завершения:** DTO не используются как изменяемые UI-модели.

---

## Stage 16. Декомпозиция server API

**Цель:** сделать server-часть модульной и тестируемой.

- [ ] Сгруппировать endpoints по ресурсам.
- [ ] Создать `server/shared/external-api`.
- [ ] Создать gateway для auth/documents/dictionaries/files.
- [ ] Сделать endpoints тонкими.
- [ ] Централизовать authorization forwarding.
- [ ] Централизовать error/status mapping.
- [ ] Удалить debug logging и неявное проглатывание ошибок.
- [ ] Добавить тесты gateway и endpoint contracts.
- [ ] Проверить server/client boundary архитектурным тестом.

**Критерий завершения:** детали внешнего API не размазаны по endpoint-файлам.

---

## Stage 17. Удаление compatibility-слоя и дублей

**Цель:** не оставить после миграции две параллельные архитектуры.

- [ ] Составить список временных re-export/aliases.
- [ ] Перевести все потребители на публичные API модулей.
- [ ] Удалить старые `app/api`, глобальные business composables и stores.
- [ ] Удалить доказанные дубли компонентов.
- [ ] Удалить неиспользуемые types/utils.
- [ ] Удалить пустые каталоги.
- [ ] Проверить отсутствие старых import roots.
- [ ] Проверить отсутствие dead code и orphan exports.

**Критерий завершения:** в проекте существует только одна актуальная реализация каждого сценария.

---

## Stage 18. Документация для дальнейшей разработки

**Цель:** новый разработчик должен понимать, куда добавлять код, не изучая весь проект.

- [ ] Обновить корневой README.
- [ ] Добавить `docs/architecture/ARCHITECTURE.md`.
- [ ] Добавить `docs/architecture/MODULE_MAP.md`.
- [ ] Добавить инструкцию `HOW_TO_ADD_MODULE.md`.
- [ ] Добавить инструкцию `HOW_TO_ADD_PAGE.md`.
- [ ] Добавить правила public API.
- [ ] Добавить карту разрешённых зависимостей.
- [ ] Добавить команды локальной проверки и CI.
- [ ] Добавить checklist для code review.
- [ ] Добавить примеры правильного и запрещённого импорта.

**Критерий завершения:** новый модуль или страница создаются по документированному шаблону и проходят архитектурные тесты.

---

## Stage 19. Финальная регрессия и стабилизация

**Цель:** подтвердить достижение итоговой цели.

- [ ] Выполнить чистую установку зависимостей.
- [ ] Выполнить `npm run check`.
- [ ] Проверить production build.
- [ ] Проверить основные маршруты.
- [ ] Проверить auth/session bootstrap.
- [ ] Проверить dictionaries cache.
- [ ] Проверить document registry.
- [ ] Проверить create document.
- [ ] Проверить file preview.
- [ ] Проверить control flow.
- [ ] Проверить signing flow.
- [ ] Проверить personal dashboard.
- [ ] Проверить отсутствие сетевых обращений к незаявленным внешним CDN.
- [ ] Проверить отсутствие циклических зависимостей.
- [ ] Проверить нулевой architecture baseline.
- [ ] Сформировать финальный отчёт `docs/architecture/FINAL_MIGRATION_REPORT.md`.

**Критерий завершения:** все проверки зелёные, документация актуальна, архитектурные ограничения автоматически соблюдаются.

---

# 5. Definition of Done всей миграции

Миграция считается завершённой только при одновременном выполнении всех условий:

- [ ] каждый бизнес-сценарий имеет одного владельца-модуль;
- [ ] прямые внутренние импорты между модулями отсутствуют;
- [ ] public API модулей минимальны и стабильны;
- [ ] `shared` не содержит предметной логики;
- [ ] страницы являются тонкими route adapters;
- [ ] client/server contracts отделены от UI-моделей;
- [ ] server endpoints являются тонкими;
- [ ] дубли и временные compatibility-слои удалены;
- [ ] архитектурные нарушения блокируют CI;
- [ ] ключевые сценарии покрыты регрессионными тестами;
- [ ] `npm run check` проходит на чистом окружении;
- [ ] разработчик может добавить новый модуль по документации без нарушения границ;
- [ ] архитектура допускает дальнейшую разработку и сопровождение без возврата к глобальным каталогам по типам файлов.

---

# 6. Журнал выполнения

После каждого этапа добавлять запись следующего формата:

```text
Дата:
Этап:
Статус:
Изменённые области:
Добавленные проверки:
Результат npm run check:
Сохранённое поведение:
Найденные риски:
Следующий этап:
```

## Записи

### 2026-08-03 — создание рабочего плана

- **Этап:** подготовка roadmap.
- **Статус:** выполнено.
- **Изменённые области:** добавлен `docs/architecture/MODULAR_ARCHITECTURE_ROADMAP.md`.
- **Добавленные проверки:** пока не добавлялись; их реализация начинается со Stage 2 и Stage 3.
- **Результат npm run check:** команда в исходном проекте отсутствует.
- **Сохранённое поведение:** код приложения не изменялся.
- **Найденные риски:** проект не имеет typecheck/lint/test/check scripts; присутствуют несогласованные импорты и дубли.
- **Следующий этап:** Stage 0 — фиксация исходного состояния.
````

## File: nuxt.config.ts
````typescript
export default defineNuxtConfig({
    telemetry: false,

    runtimeConfig: {
        apiSecret: process.env.NUXT_API_SECRET,
        signingApi: process.env.NUXT_SIGNING_API,
    },
    
    compatibilityDate: '2026-04-13',
    
    devtools: {
        enabled: true
    },
    
    vite: {
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
                '@vueuse/core',
                '@internationalized/date',
            ]
        }
    },
    
    devServer: {
        host: '150.1.7.218',
        port: 3000,
    },
    
    ssr: true,
    
    typescript: {
      strict: true,
    },
    
    app: {
        head: {
            htmlAttrs: {
                lang: 'ru-RU',
            },
        },
    },
    
    css: [
        '~/assets/css/main.css',
    ],
    
    imports: {
        autoImport: true,
        dirs: ['~/composables/**'],
    },
    
    modules: [
        '@nuxt/ui',
        '@nuxt/icon',
        '@pinia/nuxt',
    ],
    
    pinia: {
        storesDirs: ['./stores/**'],
    },
    
    ui: {
        fonts: false,
    },
    
    icon: {
        serverBundle: 'local',
        provider: 'server',
        collections: ['lucide'],
        fallbackToApi: false,
    },

    components: { 
        dirs: 
        [
            { 
                path: '~/components/ui', pathPrefix: true 
            }
        ] 
    }
})
````

## File: package.json
````json
{
  "search": "clerical_work_signing_client",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "@egjs/vue3-infinitegrid": "^4.13.0",
    "@fancyapps/ui": "^6.1.13",
    "@nuxt/fonts": "^0.14.0",
    "@nuxt/icon": "^2.2.1",
    "@nuxt/ui": "^4.5.0",
    "@pinia/nuxt": "^0.11.3",
    "chart.js": "^4.5.1",
    "jsonwebtoken": "^9.0.3",
    "lucide": "^0.576.0",
    "nuxt": "^4.2.2",
    "reka-ui": "^2.9.5",
    "tailwindcss": "^4.2.1",
    "vue": "^3.5.25",
    "vue-router": "^4.6.3"
  },
  "devDependencies": {
    "@iconify-json/lucide": "^1.2.95",
    "@types/jsonwebtoken": "^9.0.10"
  }
}
````

## File: README.md
````markdown
# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
````

## File: tsconfig.json
````json
{
  // https://nuxt.com/docs/guide/concepts/typescript
  "files": [],
  "references": [
    {
      "path": "./.nuxt/tsconfig.app.json"
    },
    {
      "path": "./.nuxt/tsconfig.server.json"
    },
    {
      "path": "./.nuxt/tsconfig.shared.json"
    },
    {
      "path": "./.nuxt/tsconfig.node.json"
    }
  ]
}
````
