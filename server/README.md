# Server architecture

`server/api` содержит только H3 route adapters. Они читают и валидируют входные данные, вызывают gateway и формируют локальный API response.

`server/modules` владеет интеграцией с внешним signing API по предметным областям: `auth`, `documents`, `dictionaries`, `files`.

`server/shared/external-api` централизует base URL, forwarding авторизации и преобразование ошибок.

Запрещено:

- вызывать `$fetch` или `fetch` из endpoint-файлов;
- импортировать `app/modules` из server-кода;
- размещать URL внешнего API вне gateway;
- заменять любой upstream status безусловным HTTP 500;
- добавлять debug logging в transport path.
