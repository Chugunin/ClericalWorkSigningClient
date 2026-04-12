import type {ApiResponse} from "#shared/types/api/api-response";

export default defineEventHandler(async (event) => {    
    const config = useRuntimeConfig(event);
    const signingApi = config.signingApi;

    // Конфигурация для всех запросов
    const fetchOptions: any = {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    };

    // Массив URL для словарей
    const dictionaryEndpoints = [
        "/api/signing/dics/GetSigningDocumentFileTypes",
        "/api/signing/dics/GetSigningDocumentStatusTypes",
        "/api/signing/dics/GetSigningDepartments",
        "/api/signing/dics/GetSigningPersons",
        "/api/signing/dics/GetSigningPersonDecisionTypes",
        "/api/signing/dics/GetSigningPersonRightTypes",
        "/api/signing/dics/GetSigningPersonRoleTypes",
        "/api/signing/dics/GetSigningDocumentOriginTypes"
    ];

    try {
        // Параллельные запросы к API
        const responses = await Promise.all(
            dictionaryEndpoints.map((endpoint) =>
                fetch(`${signingApi}${endpoint}`, fetchOptions)
            )
        );

        // Проверка успешности всех ответов
        const hasError = responses.some((response) => !response);
        
        if (hasError) {
            return <ApiResponse> {
                statusCode: 500,
                statusText: "One or more dictionary requests failed",
                data: [],
            };
        }

        // Возврат структурированных данных
        return <ApiResponse> {
            statusCode: 200,
            statusText: "Success",
            data: {
                SigningDocumentFileTypes: (await responses[0].json()) ?? [],
                SigningDocumentStatusTypes: (await responses[1].json()) ?? [],
                SigningDepartments: (await responses[2].json()) ?? [],
                SigningPersons: (await responses[3].json()) ?? [],
                SigningPersonDecisionTypes: (await responses[4].json()) ?? [],
                SigningPersonRightTypes: (await responses[5].json()) ?? [],
                SigningPersonRoleTypes: (await responses[6].json()) ?? [],
                SigningDocumentOriginTypes: (await responses[7].json()) ?? [],
            },
        };
    } catch (error) {
        console.error("Dictionary fetch error:", error);
        return <ApiResponse> {
            statusCode: 500,
            statusText: "Internal Server Error",
            data: error instanceof Error ? error.message : String(error),
        };
    }
});