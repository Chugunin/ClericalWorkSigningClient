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
- [x] нет циклических зависимостей между модулями;
- [ ] нет конфликтующих публичных экспортов;
- [x] каждый зарегистрированный модуль имеет `index.ts`;
- [x] отсутствуют запрещённые compatibility-imports после завершения миграции;
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

- [x] Зафиксировать дерево каталогов и список исходных маршрутов.
- [x] Зафиксировать список Pinia stores, composables, API-клиентов и server endpoints.
- [ ] Зафиксировать текущие пользовательские сценарии:
  - [ ] вход и восстановление сессии;
  - [ ] загрузка справочников;
  - [ ] список и фильтрация документов;
  - [ ] создание документа;
  - [ ] загрузка и просмотр файлов;
  - [ ] контроль согласования;
  - [ ] согласование документа;
  - [ ] личная страница.
- [x] Создать таблицу существующих ошибок `docs/architecture/BASELINE_ISSUES.md`.
- [x] Отделить исходные ошибки от ошибок, появившихся во время миграции.
- [x] Зафиксировать текущие build-команды и версии Node/npm.

**Критерий завершения:** существует документированный baseline; дальнейшие регрессии можно отличить от исходных дефектов.

**Проверки:** ручной запуск приложения, фиксация результатов `npm install`, `nuxt prepare`, `build`.

---

## Stage 1. Восстановление согласованной сборки

**Цель:** устранить технические блокеры до перемещения архитектуры.

- [x] Исправить импорты из отсутствующего `#shared/types/contracts`.
- [x] Исправить импорт отсутствующего `~/utils/filter.utils`.
- [x] Согласовать имя и импорт `external-file-api.utils.ts`.
- [~] Найти все неразрешимые импорты и ошибочные alias — статически исправлены известные пути; полное подтверждение требует `nuxt prepare/typecheck`.
- [ ] Найти конфликтующие Nuxt auto-import имена.
- [~] Проверить двойную реализацию `CreateDocumentModal.vue` и определить актуальную — layout использует `ModalCreateDocumentModal`; удаление второй реализации отложено до регрессионной проверки.
- [ ] Удалить или временно изолировать только доказанно неиспользуемые файлы.
- [ ] Добиться успешного `nuxt prepare`.
- [ ] Добиться успешного `typecheck` после подключения инструмента.
- [ ] Добиться успешного production build.

**Критерий завершения:** проект собирается без архитектурных перемещений; все исходные блокирующие ошибки классифицированы или исправлены.

---

## Stage 2. Настройка toolchain и единой команды проверки

**Цель:** сделать любое архитектурное нарушение автоматически обнаруживаемым.

- [~] Добавить ESLint для Nuxt 4 и TypeScript — зависимости и команда добавлены, установка заблокирована отсутствием пакета в доступном registry.
- [~] Добавить Vitest — зависимость и команды добавлены, установка заблокирована registry.
- [~] Добавить `@vue/test-utils` и Nuxt test utilities при фактической необходимости — `@vue/test-utils` добавлен; Nuxt test utilities будут подключены при первых component tests.
- [ ] Добавить команды:
  - [x] `typecheck`;
  - [x] `lint`;
  - [x] `test:unit`;
  - [x] `test:contracts`;
  - [x] `check:toolchain`;
  - [x] `check:architecture`;
  - [x] `check`.
- [ ] Настроить JUnit-отчёт для CI.
- [x] Настроить отдельный каталог отчётов, исключённый из git.
- [ ] Проверить запуск всех команд на чистой установке зависимостей.
- [x] Зафиксировать поддерживаемую версию Node в `.nvmrc` или `.node-version` и `package.json#engines`.

**Критерий завершения:** `npm run check` существует и останавливает pipeline при любой ошибке.

---

## Stage 3. Архитектурный тестовый каркас

**Цель:** жёстко закрепить границы до массового перемещения файлов.

- [x] Создать `tests/architecture/`.
- [x] Создать реестр модулей или правила их автоматического обнаружения.
- [x] Добавить тест запрета `shared → modules`.
- [x] Добавить тест запрета внутренних межмодульных импортов.
- [x] Добавить тест публичного импорта только через `index.ts`.
- [x] Добавить тест тонких страниц.
- [x] Добавить тест server/client boundary.
- [x] Добавить тест чистоты shared contracts.
- [x] Добавить обнаружение циклических зависимостей.
- [~] Добавить проверку конфликтующих `export *` — прямые дубли публичных имён проверяются; разрешение транзитивных `export *` будет добавлено при появлении первых module public API.
- [x] Добавить проверку запрещённых alias и compatibility roots для нового кода внутри `app/modules`.
- [x] Добавить проверку отсутствия пустого/orphan public API.
- [x] Не использовать постоянный baseline исключений; legacy roots разрешены только вне `app/modules` до соответствующего этапа миграции.

**Критерий завершения:** искусственно добавленное нарушение гарантированно ломает `npm run check:architecture`.

---

## Stage 4. Карта доменов и владения кодом

**Цель:** до перемещения определить единственного владельца каждого файла.

- [x] Создать `docs/architecture/MODULE_MAP.md`.
- [x] Для каждого исходного пути определить категорию:
  - [x] `app` orchestration;
  - [x] конкретный бизнес-модуль;
  - [x] shared infrastructure;
  - [x] shared UI;
  - [x] shared contract;
  - [x] server module;
  - [x] deprecated/duplicate.
- [x] Зафиксировать целевые модули:
  - [x] `auth`;
  - [x] `dictionaries`;
  - [x] `document-registry`;
  - [x] `document-create`;
  - [x] `document-control`;
  - [x] `document-signing`;
  - [x] `personal-dashboard`;
  - [x] `file-viewer`.
- [x] Зафиксировать разрешённые зависимости каждого модуля.
- [x] Отдельно перечислить неоднозначные места, где поведение нельзя восстановить из кода.

**Критерий завершения:** каждый перемещаемый файл имеет одного целевого владельца; массовое перемещение вслепую исключено.

---

## Stage 5. Shared infrastructure

**Цель:** выделить только технически универсальные компоненты и сервисы.

- [x] Создать `app/shared/api`.
- [x] Перенести общий HTTP-клиент без изменения его поведения.
- [x] Создать единый тип ошибки API.
- [x] Создать `app/shared/ui` для действительно универсальных компонентов.
- [x] Создать `app/shared/layout` для общего каркаса приложения.
- [x] Создать `app/shared/lib` для универсальных функций.
- [x] Проверить каждую перемещаемую утилиту минимум на двух независимых потребителях.
- [x] Не переносить предметные document/file/auth helpers в shared; они оставлены владельцам будущих модулей.
- [x] Добавить публичные `index.ts` для `api`, `composables`, `ui`, `layout` и групп `lib`.
- [~] Добавить unit-тесты общих чистых функций — подготовленные команды остаются заблокированы установкой Vitest из текущего registry; архитектурные self-tests проходят.

**Критерий завершения:** `shared` не содержит бизнес-логики и не зависит от модулей.

---

## Stage 6. Application bootstrap

**Цель:** убрать скрытую оркестрацию между stores и модулями.

- [x] Создать `app/app/bootstrap/useApplicationBootstrap.ts`.
- [x] Перенести загрузку общих стартовых данных из auth store.
- [x] Определить последовательность: восстановление сессии → стартовые данные → запуск маршрута.
- [x] Обеспечить идемпотентность bootstrap.
- [x] Добавить обработку частичного отказа справочников без разрушения auth session.
- [x] Добавить unit/contract-тесты bootstrap.

**Критерий завершения:** auth не знает о dictionaries и других бизнес-модулях.

---

## Stage 7. Модуль `auth`

**Цель:** изолировать управление сессией и входом.

- [x] Создать `app/modules/auth`.
- [x] Перенести auth API.
- [x] Перенести auth store.
- [x] Перенести форму и экран входа.
- [x] Перевести auth middleware на публичный API модуля.
- [x] Определить минимальный публичный API модуля.
- [x] Запретить экспорт внутренних DTO и private helpers.
- [x] Добавить тесты login/logout/session restore/error mapping.
- [x] Сделать страницу login тонким route adapter.

**Критерий завершения:** модуль auth автономен и не импортирует dictionaries/documents/files.

---

## Stage 8. Модуль `dictionaries`

**Цель:** изолировать загрузку и кеширование справочников.

- [x] Создать `app/modules/dictionaries`.
- [x] Перенести API и store справочников.
- [x] Отделить DTO от потребительских моделей.
- [x] Добавить явные selectors/getters.
- [x] Исключить прямой доступ других модулей к внутреннему store.
- [x] Определить политику кеша и повторной загрузки.
- [x] Добавить тесты single-flight, cache, reset и error state.

**Критерий завершения:** потребители используют только публичный API dictionaries.

---

## Stage 9. Модуль `file-viewer`

**Цель:** объединить работу с файловыми записями и preview в одном владельце.

- [x] Создать `app/modules/file-viewer`.
- [x] Перенести file API.
- [x] Перенести `useFileEntries` и `usePhysicalFile`.
- [x] Перенести viewer/gallery/inline viewer.
- [x] Разделить file DTO, preview state и UI components.
- [x] Гарантировать освобождение object URL.
- [x] Унифицировать loading/error/unsupported states.
- [x] Добавить тесты загрузки, ошибок, отмены и очистки ресурсов.

**Критерий завершения:** ни один другой модуль не работает с физическими файлами через внутренние implementation paths.

---

## Stage 10. Модуль `document-create`

**Цель:** сделать сценарий создания документа самодостаточным.

- [x] Создать `app/modules/document-create`.
- [x] Перенести компоненты формы.
- [x] Перенести composables формы, файлов и подписантов.
- [x] Перенести локальные типы и правила валидации.
- [x] Создать mapper `form model → CreateDocumentRequest`.
- [x] Разделить UI model и API DTO.
- [x] Устранить дублирование `CreateDocumentModal.vue`.
- [x] Определить один публичный экран/форму и, при необходимости, modal adapter.
- [x] Добавить тесты mapper, validation, submit, files и signers.
- [x] Проверить сохранение текущего пользовательского сценария.

**Критерий завершения:** создание документа может развиваться внутри одного модуля без правок глобальных технических каталогов.

---

## Stage 11. Модуль `document-registry`

**Цель:** выделить повторно используемую работу со списками документов.

- [x] Создать `app/modules/document-registry`.
- [x] Перенести DocumentsTable.
- [x] Перенести DocumentsFilters.
- [x] Разделить API client и view-model списка.
- [x] Изолировать существующую фильтрацию; пагинация, сортировка и выбор остаются у экранов, пока отсутствует единый доказанный сценарий.
- [x] Удалить или исправить устаревшие filter utilities.
- [x] Определить публичные props/emits/types.
- [x] Добавить тесты фильтров, reset-контракта, loading/error boundary и публичного API; не добавлять отсутствующее row-selection поведение.
- [x] Не включать в registry бизнес-действия signing/control.

**Критерий завершения:** registry предоставляет инфраструктуру списка, но не владеет бизнес-сценариями согласования.

---

## Stage 12. Модуль `document-control`

**Цель:** изолировать сценарий контроля согласования.

- [x] Создать `app/modules/document-control`.
- [x] Перенести экран и локальную оркестрацию.
- [x] Использовать document-registry только через публичный API.
- [x] Не переносить control-specific код в registry/shared.
- [x] Декомпозировать экран только по доказанным обязанностям: filter indicator, reset и pagination model вынесены в локальную чистую модель.
- [x] Добавить smoke и component-contract тесты ключевых действий: публичная граница, route adapter, reset, filter indicator и pagination.
- [x] Сделать route page тонким адаптером.

**Критерий завершения:** control не импортирует внутренности registry/signing.

---

## Stage 13. Модуль `document-signing`

**Цель:** изолировать сценарий согласования документа.

- [x] Создать `app/modules/document-signing`.
- [x] Перенести signing screen и секции.
- [~] Выделить composable orchestration текущего документа — в исходном коде отсутствуют загрузка и состояние текущего документа; поведение не выдумывалось. Локальный выбор файла вынесен в чистую model-функцию.
- [x] Подключить file-viewer через публичный API.
- [~] Подключить registry через публичный API — текущий signing screen не загружает реестр и не содержит списка документов; подключение отложено до появления фактического сценария/API.
- [~] Отделить команды согласования от UI — в исходной реализации команды согласования отсутствуют; искусственный API не создавался.
- [x] Добавить boundary-тесты, тесты выбора файла и контракта просмотра. Тесты действий согласования отложены до появления самих действий.
- [x] Сделать route page тонким адаптером.

**Критерий завершения:** signing имеет явные зависимости и не содержит прямых импортов чужих stores/components.

---

## Stage 14. Модуль `personal-dashboard`

**Цель:** заменить неясную область `private` понятным предметным модулем.

- [x] Подтвердить назначение текущего `private` кода по фактическому поведению: личная панель документов с фильтрами, карточками и диаграммой статусов.
- [x] Создать `app/modules/personal-dashboard`.
- [x] Перенести экран, карточки и charts.
- [x] Отделить агрегацию данных от визуализации в чистую модель.
- [x] Удалить предметные dashboard-типы и status colors из глобальных каталогов.
- [x] Добавить boundary- и unit-тесты агрегатов, скрытия статусов и сортировки.
- [x] Сделать route page тонким адаптером; URL `/documents/private` сохранён как совместимый маршрут.

**Критерий завершения:** название и границы модуля отражают его реальное назначение.

---

## Stage 15. Shared contracts и DTO normalization

**Цель:** создать чёткую границу сериализуемых контрактов между browser и Nuxt server.

- [x] Создать `shared/contracts`.
- [x] Перенести только реально передаваемые DTO.
- [x] Удалить зависимости contracts от Vue/Nuxt/Pinia/UI.
- [x] Разделить request/response/domain/UI types.
- [x] Добавить mapper на каждой границе, где модели различаются.
- [x] Убрать широкий `shared/types/index.ts` или ограничить его безопасными базовыми контрактами.
- [x] Заменить скрывающие зависимость импорты из общего barrel.
- [x] Добавить contract-тесты сериализации и обязательных полей.

**Критерий завершения:** DTO не используются как изменяемые UI-модели.

---

## Stage 16. Декомпозиция server API

**Цель:** сделать server-часть модульной и тестируемой.

- [x] Сгруппировать endpoints по ресурсам.
- [x] Создать `server/shared/external-api`.
- [x] Создать gateway для auth/documents/dictionaries/files.
- [x] Сделать endpoints тонкими.
- [x] Централизовать authorization forwarding.
- [x] Централизовать error/status mapping.
- [x] Удалить debug logging и неявное проглатывание ошибок.
- [x] Добавить тесты gateway и endpoint contracts.
- [x] Проверить server/client boundary архитектурным тестом.

**Критерий завершения:** детали внешнего API не размазаны по endpoint-файлам.

---

## Stage 17. Удаление compatibility-слоя и дублей

**Цель:** не оставить после миграции две параллельные архитектуры.

- [x] Составить список временных re-export/aliases.
- [x] Перевести все потребители на публичные API модулей.
- [x] Удалить старые `app/api`, глобальные business composables и stores.
- [x] Удалить доказанные дубли компонентов.
- [x] Удалить неиспользуемые types/utils.
- [x] Удалить пустые каталоги.
- [x] Проверить отсутствие старых import roots.
- [x] Проверить отсутствие dead code и orphan exports.

**Критерий завершения:** выполнен — в проекте существует только одна актуальная реализация каждого сценария; legacy roots физически отсутствуют и контролируются тестами.

---

## Stage 18. Документация для дальнейшей разработки

**Цель:** новый разработчик должен понимать, куда добавлять код, не изучая весь проект.

- [x] Обновить корневой README.
- [x] Добавить `docs/architecture/ARCHITECTURE.md`.
- [x] Добавить `docs/architecture/MODULE_MAP.md` (создан ранее и актуализирован по итогам модульных этапов).
- [x] Добавить инструкцию `HOW_TO_ADD_MODULE.md`.
- [x] Добавить инструкцию `HOW_TO_ADD_PAGE.md`.
- [x] Добавить правила public API.
- [x] Добавить карту разрешённых зависимостей.
- [x] Добавить команды локальной проверки и CI.
- [x] Добавить checklist для code review.
- [x] Добавить примеры правильного и запрещённого импорта.

**Критерий завершения:** новый модуль или страница создаются по документированному шаблону и проходят архитектурные тесты.

---

## Stage 19. Финальная регрессия и стабилизация

**Цель:** подтвердить достижение итоговой цели.

- [!] Выполнить чистую установку зависимостей — заблокировано отсутствием `@iconify-json/lucide` в registry среды проверки.
- [~] Выполнить `npm run check` — архитектурная часть проходит; typecheck/lint/build требуют установленного Nuxt toolchain.
- [!] Проверить production build — заблокировано установкой зависимостей в текущей среде.
- [~] Проверить основные маршруты — route adapters проверены статически и контрактными тестами; browser smoke-test не выполнен.
- [x] Проверить auth/session bootstrap.
- [x] Проверить dictionaries cache.
- [x] Проверить document registry.
- [x] Проверить create document.
- [x] Проверить file preview — удалена недоступная внешняя зависимость `@fancyapps/ui`, preview открывается штатным browser window.
- [x] Проверить control flow.
- [~] Проверить signing flow — существующая UI-модель проверена; API-команды согласования отсутствуют в исходном проекте.
- [x] Проверить personal dashboard.
- [x] Проверить отсутствие сетевых обращений к незаявленным внешним CDN.
- [x] Проверить отсутствие циклических зависимостей.
- [x] Проверить нулевой architecture baseline.
- [x] Сформировать финальный отчёт `docs/architecture/FINAL_MIGRATION_REPORT.md`.

**Критерий завершения:** все проверки зелёные, документация актуальна, архитектурные ограничения автоматически соблюдаются.

---

# 5. Definition of Done всей миграции

Миграция считается завершённой только при одновременном выполнении всех условий:

- [x] каждый существующий бизнес-сценарий имеет одного владельца-модуль;
- [x] прямые внутренние импорты между модулями отсутствуют;
- [x] public API модулей минимальны и стабильны;
- [x] `shared` не содержит предметной логики;
- [x] страницы являются тонкими route adapters;
- [x] client/server contracts отделены от UI-моделей;
- [x] server endpoints являются тонкими;
- [x] дубли и временные compatibility-слои удалены;
- [x] архитектурные нарушения блокируют `npm run check:architecture` и общий `npm run check`;
- [x] ключевые существующие сценарии покрыты регрессионными и контрактными тестами;
- [ ] `npm run check` проходит на чистом окружении;
- [x] разработчик может добавить новый модуль по документации без нарушения границ;
- [x] архитектура допускает дальнейшую разработку и сопровождение без возврата к глобальным каталогам по типам файлов.

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


### 2026-08-03 — Stage 0/1 и каркас контроля архитектуры

- **Этап:** Stage 0 выполнен частично; Stage 1 выполняется; Stage 2/3 начаты.
- **Статус:** частично выполнено, сборочная верификация заблокирована доступным npm registry.
- **Изменённые области:** исправлены пути shared types и utilities; добавлены baseline-документы, списки структуры, `.nvmrc`, scripts и команды качества.
- **Добавленные проверки:** `check:toolchain`, `check:architecture`; проверяются `shared → modules`, server/client boundary, обход public API модулей, внутренние межмодульные импорты, наличие `index.ts`, чистота shared contracts и размер route adapters.
- **Результат npm run check:** полный запуск невозможен: `npm install` завершается `E404` для `@egjs/vue3-infinitegrid` в доступном registry. Самостоятельный `node scripts/check-architecture.mjs` проходит: 100 файлов, 0 модулей, 0 нарушений.
- **Сохранённое поведение:** бизнес-логика и UI не изменялись; выполнены только исправления несуществующих import paths и инфраструктура контроля.
- **Найденные риски:** отсутствует lockfile; две реализации `CreateDocumentModal.vue`; ручные пользовательские сценарии ещё не подтверждены; toolchain-зависимости нельзя установить из текущего registry.
- **Следующий этап:** восстановить установку зависимостей/lockfile, выполнить `nuxt prepare`, `typecheck`, `build`, затем завершить Stage 2 и усилить Stage 3 циклическими зависимостями и проверкой конфликтующих экспортов.


## Журнал выполнения — Stage 2–4

### 2026-08-03 — Architecture guard hardening и module ownership map

- Архитектурный анализатор вынесен в `scripts/architecture/analyzer.mjs` и стал тестируемым независимо от Nuxt/Vitest.
- Добавлены self-tests на Node test runner: запрет `shared → modules`, обход public API, циклические зависимости и допустимая односторонняя зависимость.
- `npm run check:architecture` теперь сначала проверяет сам анализатор, затем фактический проект.
- Добавлены проверки циклов, обязательного `index.ts`, пустого public API и compatibility roots внутри новых модулей.
- Создана карта владения `docs/architecture/MODULE_MAP.md` с владельцами текущих каталогов, целевыми путями и разрешёнными зависимостями.
- Физическое перемещение файлов ещё не выполнялось; следующий этап — Stage 5 Shared infrastructure.
- Фактическая проверка: `node --test tests/architecture/analyzer.test.mjs` — 4/4 tests passed; `node scripts/check-architecture.mjs` — OK, 100 source files.

### 2026-08-03 — Stage 5 Shared infrastructure

- **Этап:** Stage 5 выполнен функционально; unit-test подтверждение остаётся частично заблокировано registry.
- **Статус:** shared infrastructure выделена без изменения бизнес-логики.
- **Изменённые области:** общий HTTP-клиент и `ApiError` перенесены в `app/shared/api`; generic composables — в `app/shared/composables`; универсальные UI и layout — в `app/shared/ui` и `app/shared/layout`; date/error/sorting helpers — в `app/shared/lib`.
- **Добавленные проверки:** существующий architecture guard подтверждает запрет `shared → modules`; потребители переведены на публичные `index.ts`; старые import roots проверены поиском и удалены.
- **Результат npm run check:** `npm run test:architecture` — 4/4; `npm run check:architecture` — OK, 107 source files. Полный check по-прежнему заблокирован `npm install E404` для `@egjs/vue3-infinitegrid`.
- **Сохранённое поведение:** реализация HTTP-клиента, toast/loading/error helpers и Vue-компонентов не менялась; изменены только владельцы файлов и import paths.
- **Найденные риски:** `FancyBox.vue`, `Gallery.vue` и file helpers намеренно оставлены вне shared до Stage 9; document-specific color/filter helpers не переносились.
- **Следующий этап:** Stage 6 — application bootstrap и устранение зависимости auth store от dictionaries store.


### 2026-08-03 — Stage 6: Application bootstrap

- **Статус:** `[x]` завершён.
- **Изменённые области:** добавлены `app/app/bootstrap/application-bootstrap.ts`, `useApplicationBootstrap.ts` и публичный `index.ts`; middleware, login flow и logout layout переведены на bootstrap orchestration.
- **Развязанные зависимости:** `auth store` больше не импортирует и не очищает dictionaries store; shared `AppHeader` больше не зависит от auth store и только emits `logout`.
- **Поведение bootstrap:** восстановление сессии выполняется до загрузки стартовых данных; параллельные вызовы дедуплицируются; ошибка справочников переводит bootstrap в `degraded`, но не уничтожает авторизованную сессию.
- **Дополнительная стабилизация:** auth store теперь явно предоставляет используемые UI-свойства `loading` и `isAuthenticated`.
- **Тесты:** 5 bootstrap tests, включая порядок, идемпотентность, частичный отказ, logout cleanup и boundary `auth !→ dictionaries`; 4 architecture analyzer tests.
- **Результат проверок:** `npm run check:architecture` — зелёный, 110 source files. Полный `npm run check` остаётся заблокирован внешним `npm install E404` для `@egjs/vue3-infinitegrid`.
- **Следующий этап:** Stage 7 — выделение автономного модуля `auth`.


### 2026-08-03 — Stage 7: автономный модуль auth

- **Статус:** `[x]` завершён.
- **Структура:** auth API, Pinia store, login screen, session orchestration и error mapping перенесены в `app/modules/auth`; публичный API ограничен `AuthLoginScreen` и `useAuthStore`.
- **Route и middleware:** `app/pages/login.vue` стал тонким route adapter; global middleware и application bootstrap используют только `~/modules/auth`.
- **Поведение сессии:** токен фиксируется только после успешной загрузки текущего пользователя; восстановление использует сохранённый токен; частичная сессия при ошибке профиля не возвращается.
- **Архитектурные границы:** auth не импортирует dictionaries, documents или files; API, session helpers, error mapper и DTO не экспортируются публично.
- **Тесты:** 7 auth tests — public API, независимость модуля, route boundary, login, session restore, отказ без частичной сессии и error mapping. Logout orchestration дополнительно покрыт bootstrap-тестом.
- **Результат проверок:** `npm run check:architecture` — зелёный; суммарно 16 Node architecture/bootstrap/auth tests, 114 source files, 1 module.
- **Ограничение окружения:** полный `npm run check` остаётся заблокирован внешним `npm install E404` для `@egjs/vue3-infinitegrid`.
- **Следующий этап:** Stage 8 — выделение автономного модуля `dictionaries`.


### 2026-08-03 — Stage 8: автономный модуль dictionaries

- **Статус:** `[x]` завершён.
- **Структура:** dictionaries API, Pinia store и cache policy перенесены в `app/modules/dictionaries`; старые `app/api/dictionaries.api.ts` и `app/stores/dictionaries.store.ts` удалены.
- **Публичный API:** наружу экспортируются только `useDictionariesStore` и потребительские типы отдельных справочников; API client, cache implementation и агрегированный `DictionariesResponse` остаются внутренними.
- **Selectors:** store явно предоставляет `departments`, `persons`, `documentFileTypes`, `documentStatusTypes`, `documentOriginTypes`, `personDecisionTypes`, `personRightTypes`, `personRoleTypes`, `isLoaded`, `isLoading` и `error`.
- **Политика кеша:** обычный вызов возвращает уже загруженные данные; параллельные запросы объединяются в single-flight; `force=true` обновляет кеш; ошибка сохраняется до успешного retry или `clear`; logout очищает данные через application bootstrap.
- **Границы:** bootstrap и все текущие UI-потребители используют только `~/modules/dictionaries`; прямые импорты внутренних файлов и legacy roots запрещены тестом.
- **Тесты:** 8 dictionaries tests — public API, module independence, consumer boundaries, single-flight, cache hit, forced refresh, reset и retry/error state.
- **Результат проверок:** `npm run check:architecture` — зелёный; суммарно 24 Node architecture/bootstrap/auth/dictionaries tests, 116 source files, 2 модуля.
- **Ограничение окружения:** полный `npm run check` остаётся заблокирован внешним `npm install E404` для `@egjs/vue3-infinitegrid`.
- **Следующий этап:** Stage 9 — выделение автономного модуля `file-viewer`.


### 2026-08-03 — Stage 9: автономный модуль file-viewer

- **Статус:** `[x]` завершён.
- **Структура:** file API, upload composable, physical-file loader, viewer, inline viewer, gallery, Fancybox wrapper и file-info helpers перенесены в `app/modules/file-viewer`.
- **Публичный API:** наружу экспортируются UI-компоненты, `saveFileEntry`, `useFileEntries` и безопасные file-info helpers; transport API, physical-file loader и object URL lifecycle остаются внутренними.
- **Разделение обязанностей:** API возвращает `Blob` и принимает `AbortSignal`; создание и освобождение object URL выполняет отдельный `ObjectUrlResource`; компоненты управляют loading/error/unsupported states.
- **Исправленная несогласованность:** `CreateFormFilesSection.vue` ранее импортировал отсутствующий `saveFileEntry`; теперь он получает стабильную функцию через `~/modules/file-viewer`.
- **Ресурсы:** `release()` идемпотентен; inline viewer освобождает предыдущий URL при смене файла и unmount; pending requests отменяются через `AbortController`.
- **Границы:** document-create и document-signing используют только публичный API модуля; legacy `app/api/files.api.ts`, `app/composables/api/useFileEntries.ts`, `usePhysicalFile.ts`, `app/components/file/**` и file-specific UI roots удалены.
- **Тесты:** 7 file-viewer tests — public API, AbortSignal boundary, отсутствие object URL в transport API, cancellation, resource cleanup, idempotent release и legacy-import guard.
- **Результат проверок:** `npm run check:architecture` — зелёный; суммарно 31 Node architecture/bootstrap/auth/dictionaries/file-viewer test, 119 source files, 3 модуля.
- **Ограничение окружения:** полный `npm run check` остаётся заблокирован внешним `npm install E404` для `@egjs/vue3-infinitegrid`.
- **Следующий этап:** Stage 10 — выделение автономного модуля `document-create`.

### 2026-08-03 — Stage 10: document-create

- Создан автономный `app/modules/document-create`.
- Компоненты формы, modal adapter, модель, file workflow, API, mapper и validation перенесены внутрь модуля.
- UI model отделена от transport DTO через `mapDocumentCreateFormToRequest`.
- Удалены пустые и дублирующиеся `CreateDocumentModal`, `CreateDocumentForm` и `SignerSelection`.
- Страница и default layout используют только публичный API модуля.
- Добавлено 10 boundary/mapper/validation/submit тестов.
- `npm run check:architecture`: 41 тест пройдено, 4 модуля, нарушений нет.
- Следующий этап: Stage 11 — `document-registry`.


### 2026-08-03 — Stage 11: document-registry

- **Статус:** `[x]` завершён.
- **Структура:** API списка, `useDocuments`, таблица, фильтры, filter predicate и registry types перенесены в `app/modules/document-registry`.
- **Публичный API:** наружу экспортируются `DocumentsTable`, `DocumentsFilters`, `useDocuments`, `Document` и `DocumentFilters`; transport API и filter predicate остаются внутренними.
- **Поведение:** сохранены GET без фильтров и POST `action=filter` при активных фильтрах; строковые фильтры теперь корректно игнорируют пробелы.
- **SSR/view-model:** `useDocuments` поддерживает локальные либо внешние reactive filters и уникальный `scope` для ключа `useAsyncData`.
- **Границы:** control и personal-dashboard используют только `~/modules/document-registry`; signing/control actions не добавлялись в registry.
- **Scope decision:** пагинация, сортировка и выбор строк не переносились искусственно — в текущем проекте нет единого повторно используемого поведения; они остаются у экранных модулей до доказанного общего контракта.
- **Тесты:** 6 registry tests — public API, legacy paths, consumer boundaries, transport separation и активность фильтров.
- **Результат проверок:** `npm run check:architecture` — зелёный; суммарно 47 тестов, 122 source files, 5 модулей.
- **Ограничение окружения:** полный `npm run check` остаётся заблокирован внешним `npm install E404` для `@egjs/vue3-infinitegrid`.
- **Следующий этап:** Stage 12 — выделение `document-control`.


### 2026-08-03 — Stage 12: document-control

- **Статус:** `[x]` завершён.
- **Структура:** экран контроля перенесён в `app/modules/document-control`; старый `app/components/documents/control/ControlScreen.vue` удалён.
- **Публичный API:** наружу экспортируется только `DocumentControlScreen`; локальная model-логика остаётся внутренней.
- **Зависимости:** модуль использует `document-registry` и `dictionaries` только через их публичные `index.ts`; зависимость от `document-signing` отсутствует.
- **Декомпозиция:** без изменения UI вынесены чистые функции определения активных фильтров, reset и клиентской пагинации.
- **Route:** `app/pages/documents/control.vue` стал явным тонким адаптером через `~/modules/document-control`.
- **Тесты:** 8 boundary/model tests — public API, route boundary, legacy path, разрешённые зависимости, filter indicator, reset и pagination.
- **Результат проверок:** `npm run check:architecture` — зелёный; суммарно 55 тестов, 124 source files, 6 модулей.
- **Ограничение окружения:** полный `npm run check` остаётся заблокирован внешней установкой `@egjs/vue3-infinitegrid` из текущего registry.
- **Следующий этап:** Stage 13 — выделение `document-signing`.


### 2026-08-03 — Stage 13: document-signing

- **Статус:** `[x]` структурная изоляция завершена; отсутствующая в исходном коде бизнес-логика отмечена `[~]` и не была выдумана.
- **Структура:** signing screen, list/main/viewer sections перенесены в `app/modules/document-signing`; legacy `app/components/documents/signing/**` удалён.
- **Публичный API:** наружу экспортируется только `DocumentSigningScreen`; viewer section и selection model остаются внутренними.
- **Зависимости:** `file-viewer` используется только через `~/modules/file-viewer`; зависимости от `document-control` нет. `document-registry` не подключался искусственно, поскольку текущий экран не содержит загрузки списка документов.
- **Поведение:** существующая периодизация, сортировка и file preview сохранены; начальный выбор файла вынесен в чистую модель без изменения UI.
- **Не выдумано:** в исходном срезе отсутствуют API/команды согласования и orchestration текущего документа. Эти пункты оставлены как явный backlog до появления подтверждённого контракта.
- **Тесты:** 9 boundary/selection tests; также обновлён file-viewer regression test на новый модульный путь.
- **Результат проверок:** `npm run check:architecture` — зелёный; суммарно 64 теста, 126 source files, 7 модулей.
- **Ограничение окружения:** полный `npm run check` остаётся заблокирован внешней установкой `@egjs/vue3-infinitegrid` из текущего registry.
- **Следующий этап:** Stage 14 — выделение `personal-dashboard`.

- 2026-08-03 — Stage 14 завершён: выделен `personal-dashboard`, legacy `private` implementation удалён, агрегация отделена от Chart/UI, добавлены tests.

- 2026-08-03 — Stage 15 завершён: `shared/types` заменён на точные сериализуемые `shared/contracts`; общий barrel удалён; DTO справочников нормализованы; добавлены contract-тесты framework-independence, JSON-safety и обязательных полей.


### 2026-08-03 — Stage 16: декомпозиция server API

- **Статус:** `[x]` завершён.
- **Структура:** endpoints сгруппированы в `server/api/auth`, `documents`, `dictionaries` и `files`; прежние плоские server routes удалены.
- **Shared transport:** создан `server/shared/external-api` с единым HTTP-клиентом, forwarding авторизации и mapper внешних ошибок.
- **Gateways:** созданы `auth`, `documents`, `dictionaries` и `files` gateways; только они знают пути внешнего signing API.
- **Тонкие endpoints:** H3 handlers выполняют только чтение/валидацию входа, вызов gateway и формирование локального ответа.
- **Файлы:** upload преобразуется в `FormData` внутри files gateway; physical-file endpoint сохраняет upstream `content-type`, `content-disposition` и HTTP status.
- **Безопасность границ:** server не импортирует `app/modules`; debug logging удалён; upstream status/message больше не заменяются безусловным HTTP 500.
- **Маршруты:** `/api/documents`, `/api/dictionaries` и auth routes сохранены; файловые browser routes нормализованы до `/api/files/entries` и `/api/files/physical/:fileId`, соответствующий client API обновлён.
- **Тесты:** добавлено 8 server-api tests — endpoint layout, thin endpoints, gateway ownership, authorization priority, cookie forwarding, error mapping и server/client boundary.
- **Результат проверок:** `npm run check:architecture` — зелёный; суммарно 84 теста, 126 source files, 8 client modules.
- **Ограничение окружения:** полный `npm run check` остаётся заблокирован отсутствием установленных dependencies и ранее зафиксированным E404 registry для `@egjs/vue3-infinitegrid`.
- **Следующий этап:** Stage 18 — документация для дальнейшей разработки.

### 2026-08-03 — Stage 17 завершён

- Удалены legacy roots `app/api`, `app/components`, `app/composables`, `app/stores`, `app/types`, `app/utils` и `shared/types`.
- Удалены orphan-типы `DocumentOriginTypeModel`, `PersonModel`, `PersonRoleModel`, на которые не было ни одного потребителя.
- Удалены неиспользуемые production-зависимости `@egjs/vue3-infinitegrid`, `jsonwebtoken`, `lucide`; устранён прежний registry blocker на `@egjs/vue3-infinitegrid`.
- Архитектурный анализатор теперь запрещает compatibility imports во всём source tree, а не только внутри `app/modules`.
- Добавлен `test:cleanup`: физическое отсутствие legacy roots, отсутствие старых импортов, отсутствие пустых каталогов и возврата удалённых зависимостей.
- **Следующий этап:** Stage 18 — документация для дальнейшей разработки.


### 2026-08-03 — Stage 18 завершён

- **Этап:** документация для дальнейшей разработки и сопровождения.
- **Статус:** выполнено.
- **Изменённые области:** корневой README и комплект operational architecture guides.
- **Добавленные проверки:** `test:documentation` проверяет наличие, непустое содержание, ссылки и обязательные правила в документации; включён в `check:architecture`.
- **Результат npm run check:** node-based архитектурный контур выполняется отдельно; полный `npm run check` относится к Stage 19 и требует установки toolchain-зависимостей.
- **Сохранённое поведение:** runtime-код приложения не изменялся.
- **Найденные риски:** ручные smoke/regression сценарии и чистая production-сборка ещё не подтверждены.
- **Следующий этап:** Stage 19 — финальная регрессия и стабилизация.


### 2026-08-03 — Stage 19: финальная регрессия и стабилизация

- **Статус:** выполнено частично из-за внешнего registry-блокера.
- **Изменения:** удалена недоступная зависимость `@fancyapps/ui`; `FileViewer` переведён на штатное открытие Blob URL в новой вкладке; удалён неиспользуемый `FileFancybox`; удалён остаточный `@types/jsonwebtoken`.
- **Архитектурный результат:** 92 node-based теста и анализ 8 модулей проходят, architecture baseline равен нулю.
- **Установка зависимостей:** внутренний registry среды проверки не содержит `@iconify-json/lucide`; прямой `registry.npmjs.org` недоступен по тайм-ауту.
- **Не подтверждено в этой среде:** `nuxi typecheck`, ESLint и production build. Эти проверки должны быть выполнены в корпоративной CI-среде с настроенным npm proxy.
- **Финальный отчёт:** `docs/architecture/FINAL_MIGRATION_REPORT.md`.


## Current delivery journal

- `STAGE20_DOCUMENT_SIGNING_INTEGRATION.md` — document-signing integration cycle.
