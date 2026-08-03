# Как добавить новый модуль

## 1. Определить владельца и границы

До создания файлов зафиксировать:

- какой бизнес-сценарий принадлежит модулю;
- какие данные он получает и изменяет;
- какие существующие модули ему действительно нужны;
- что должно быть публично доступно другим слоям.

Модуль не создаётся для одного универсального компонента или одного helper — это не бизнес-граница.

## 2. Создать минимальную структуру

```text
app/modules/<module-name>/
├── components/
│   └── <ModuleName>Screen.vue
├── index.ts
└── README.md              # рекомендуется для сложного модуля
```

Добавлять `api`, `composables`, `model`, `mappers`, `types`, `utils` только когда в них появляется код. Пустые каталоги запрещены.

## 3. Создать публичный API

```ts
// app/modules/example/index.ts
export { default as ExampleScreen } from './components/ExampleScreen.vue'
export { useExampleStore } from './model/example.store'
export type { ExampleSummary } from './types/example-summary'
```

Экспортировать только то, что реально требуется внешним потребителям. API-клиент, mapper и внутренние компоненты обычно не экспортируются.

## 4. Использовать другие модули только публично

Правильно:

```ts
import { useDictionariesStore } from '~/modules/dictionaries'
```

Запрещено:

```ts
import { useDictionariesStore } from '~/modules/dictionaries/model/dictionaries.store'
```

Если нужного контракта нет в public API другого модуля, сначала оценить, должен ли он вообще быть публичным. Не обходить границу внутренним импортом.

## 5. Добавить тесты

Минимум:

- публичный API содержит только разрешённые экспорты;
- нет обхода public API;
- допустимые межмодульные зависимости;
- unit-тесты mapper/model/composable;
- regression-тест ключевого поведения.

Рекомендуемый каталог:

```text
tests/<module-name>/
└── <module-name>.test.mjs
```

Добавить команду `test:<module-name>` в `package.json` и включить её в `check:architecture` либо профиль соответствующих тестов.

## 6. Подключить маршрут

Страница импортирует только публичный экран. Подробности — `HOW_TO_ADD_PAGE.md`.

## 7. Проверить

```bash
npm run check:architecture
npm run check
```

## Checklist

- [ ] один ясный бизнес-владелец;
- [ ] минимальный `index.ts`;
- [ ] нет прямых внутренних межмодульных импортов;
- [ ] нет бизнес-логики в `shared`;
- [ ] DTO отделён от UI-модели;
- [ ] добавлены тесты;
- [ ] обновлён `MODULE_MAP.md`;
- [ ] `npm run check` проходит.
