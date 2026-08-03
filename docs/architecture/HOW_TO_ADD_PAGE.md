# Как добавить новую страницу

## 1. Страница является route adapter

Файл в `app/pages` отвечает только за:

- маршрут;
- route metadata;
- layout;
- чтение route params/query;
- передачу параметров публичному экрану модуля.

Пример:

```vue
<script setup lang="ts">
import { DocumentControlScreen } from '~/modules/document-control'

useHead({ title: 'Контроль согласования' })
</script>

<template>
  <DocumentControlScreen />
</template>
```

## 2. Страница с параметром

```vue
<script setup lang="ts">
import { ExampleDetailsScreen } from '~/modules/example'

const route = useRoute()
const exampleId = computed(() => String(route.params.id))
</script>

<template>
  <ExampleDetailsScreen :example-id="exampleId" />
</template>
```

Валидация, загрузка данных, submit и обработка ошибок принадлежат модулю, а не странице.

## 3. Запрещено

```ts
// внутренний импорт
import Screen from '~/modules/example/components/ExampleScreen.vue'

// API и store orchestration внутри страницы
const data = await $fetch('/api/example')
const state = reactive({ ... })
```

Также запрещено помещать большие template-секции и бизнес-условия непосредственно в route-файл.

## 4. Навигация

При добавлении маршрута обновить централизованную конфигурацию навигации, если маршрут должен отображаться в меню. Не дублировать route path строками в нескольких компонентах без необходимости.

## 5. Проверка

- route-файл импортирует модуль через `~/modules/<name>`;
- route params преобразованы в стабильный тип;
- экран модуля можно тестировать отдельно от router;
- `npm run check:architecture` проходит;
- добавлен smoke/regression test маршрута при наличии test environment.
