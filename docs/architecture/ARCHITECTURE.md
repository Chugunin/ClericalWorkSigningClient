# Архитектура ClericalWorkSigningClient

## 1. Назначение

Проект является модульным монолитом. Цель архитектуры — локализовать изменения внутри владельца бизнес-сценария, сделать зависимости явными и не допускать возврата к глобальным каталогам `components`, `stores`, `api`, `types`.

## 2. Направление зависимостей

```text
pages / layouts / middleware
            ↓
      app bootstrap
            ↓
        app/modules
            ↓
        app/shared
            ↓
    shared/contracts
```

Server-side направление:

```text
server/api → server/modules → server/shared → shared/contracts
```

Обратные зависимости запрещены.

## 3. Слои

### `app/modules`

Владелец бизнес-сценария. Модуль хранит относящиеся только к нему API-клиенты, компоненты, composables, store, модели, mapper и локальные helpers. Другой модуль видит только экспорт из `index.ts`.

### `app/app`

Application orchestration: запуск сессии, загрузка стартовых данных, координация нескольких модулей. Здесь не размещаются UI-компоненты и предметные модели.

### `app/shared`

Только технически универсальный код: HTTP transport, базовые UI-компоненты, layout, generic helpers. `shared` не знает о бизнес-модулях.

### `shared/contracts`

JSON-safe DTO, пересекающие client/server или внешнюю API-границу. Запрещены Vue refs, `DateValue`, компоненты, stores и функции поведения.

### `server/api`

Тонкие H3 adapters: чтение параметров, базовая валидация, вызов gateway, возврат ответа. URL внешнего API и `$fetch` в endpoint-файлах запрещены.

### `server/modules`

Gateway по предметным областям: `auth`, `documents`, `dictionaries`, `files`. Здесь находятся внешние URL, преобразование payload и работа с server transport.

## 4. Бизнес-модули

| Модуль | Владелец | Разрешённые зависимости |
|---|---|---|
| `auth` | вход, сессия, текущий пользователь | `app/shared`, `shared/contracts` |
| `dictionaries` | загрузка и кеш справочников | `app/shared`, `shared/contracts` |
| `file-viewer` | upload, preview, lifecycle object URL | `app/shared`, `shared/contracts` |
| `document-create` | форма и создание документа | `dictionaries`, `file-viewer`, shared |
| `document-registry` | список, фильтры и таблица документов | shared |
| `document-control` | сценарий контроля | `document-registry`, `dictionaries`, shared |
| `document-signing` | экран и локальный сценарий согласования | `file-viewer`, shared |
| `personal-dashboard` | личная панель и агрегация | `document-registry`, `dictionaries`, shared |

Фактическая карта и неоднозначности находятся в `MODULE_MAP.md`.

## 5. Правила, блокируемые тестами

- другой модуль нельзя импортировать через внутренний путь;
- `pages` импортируют модуль только из `~/modules/<name>`;
- `shared` не импортирует `modules`;
- `server` не импортирует client modules;
- legacy roots `~/api`, `~/components`, `~/stores`, `~/types`, `~/utils` запрещены;
- циклические зависимости запрещены;
- каждый модуль имеет непустой `index.ts`;
- shared contracts не зависят от framework;
- route adapters не содержат бизнес-логику.

## 6. Принцип размещения кода

1. Код используется одним бизнес-сценарием — разместить в его модуле.
2. Код координирует несколько модулей — разместить в `app/app`.
3. Код универсален и не содержит предметных терминов — рассмотреть `app/shared`.
4. Тип пересекает HTTP-границу и сериализуем — разместить в `shared/contracts`.
5. Код проксирует внешний API — endpoint в `server/api`, реализация в `server/modules`.

Не переносить код в shared только ради устранения неудобного импорта.

## 7. Проверка изменений

```bash
npm run check:architecture
npm run check
```

Первая команда подходит для быстрой проверки границ. Вторая является обязательным Definition of Done для merge request.
