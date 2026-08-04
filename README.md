# ClericalWorkSigningClient

Клиент системы согласования документов на Nuxt 4. Проект организован как модульный монолит: каждый бизнес-сценарий принадлежит одному модулю, межмодульные зависимости проходят только через публичные `index.ts`, а архитектурные ограничения проверяются автоматически.

## Требования

- Node.js: `>=22 <25`;
- npm: `>=10`;
- доступ к настроенному npm registry и внешнему signing API через Nuxt server routes.

Версия Node зафиксирована в `.nvmrc`.

## Запуск

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Проверки

Перед commit и merge request обязательно выполнять:

```bash
npm run check
```

Команда последовательно запускает toolchain-check, архитектурные и контрактные тесты, unit-тесты, TypeScript, ESLint и production build.

Для быстрой проверки архитектурных границ:

```bash
npm run check:architecture
```

## Структура

```text
app/
├── app/              # application bootstrap и orchestration
├── modules/          # бизнес-модули
├── shared/           # общая инфраструктура, UI и технические helpers
├── pages/            # тонкие route adapters
├── layouts/
└── middleware/
server/
├── api/              # тонкие H3 endpoints
├── modules/          # gateway внешнего API по предметным областям
└── shared/           # общий server transport и error mapping
shared/contracts/     # сериализуемые client/server DTO
```

## Архитектурная документация

Начальная точка: [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md).

- [`MODULE_MAP.md`](docs/architecture/MODULE_MAP.md) — владельцы функциональности и разрешённые зависимости;
- [`HOW_TO_ADD_MODULE.md`](docs/architecture/HOW_TO_ADD_MODULE.md) — создание бизнес-модуля;
- [`HOW_TO_ADD_PAGE.md`](docs/architecture/HOW_TO_ADD_PAGE.md) — создание маршрута;
- [`PUBLIC_API_RULES.md`](docs/architecture/PUBLIC_API_RULES.md) — правила `index.ts` и импортов;
- [`DEVELOPMENT_WORKFLOW.md`](docs/architecture/DEVELOPMENT_WORKFLOW.md) — локальный и CI workflow;
- [`CODE_REVIEW_CHECKLIST.md`](docs/architecture/CODE_REVIEW_CHECKLIST.md) — обязательный review checklist;
- [`MODULAR_ARCHITECTURE_ROADMAP.md`](docs/architecture/MODULAR_ARCHITECTURE_ROADMAP.md) — план и журнал миграции.

- [DOCUMENT_SIGNING.md](docs/architecture/DOCUMENT_SIGNING.md)
