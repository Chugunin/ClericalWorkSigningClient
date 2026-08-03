# Workflow разработки и CI

## Локальный цикл

```bash
npm install
npm run dev
```

Перед commit:

```bash
npm run check:architecture
npm run check
```

## Состав `npm run check`

1. `check:toolchain` — доступность Nuxt, TypeScript, ESLint и Vitest;
2. `check:architecture` — границы модулей и node-based contract tests;
3. `test:contracts` — Vitest contracts и architecture tests;
4. `test:unit` — unit-тесты;
5. `typecheck` — Nuxt/TypeScript;
6. `lint` — ESLint;
7. `build` — production build.

Любой шаг должен завершать pipeline с ошибкой.

## CI minimum

CI job должен:

```bash
npm ci --cache .npm --prefer-offline --no-audit
npm run check
```

Рекомендуется сохранять:

- JUnit test reports;
- build logs;
- `.nuxt`/build artifacts только при необходимости последующего deploy;
- npm cache по lockfile.

## Когда обновлять архитектурные тесты

Обновление теста допустимо только когда меняется согласованная граница. Нельзя менять тест, чтобы скрыть нарушение. Вместе с тестом обновляются:

- `MODULE_MAP.md`;
- public API модуля;
- документация потребителей;
- roadmap/journal, если работа относится к миграции.

## Ошибка внешнего registry

Ошибка установки зависимости не является успешной проверкой. Она фиксируется как инфраструктурный блокер; этапы `typecheck`, `lint`, `build` остаются невыполненными до реального запуска.
