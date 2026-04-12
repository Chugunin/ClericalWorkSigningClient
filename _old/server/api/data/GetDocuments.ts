import {ApiResponse} from "#shared/types/api/api-response";

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

    // URL для всех документов
    const endpoint = "/api/signing/GetSigningDocuments";
    
    // получение всех согласуемых документов
    if (event.method === "GET") {

        try {
            const response = await fetch(`${signingApi}${endpoint}`, fetchOptions);

            const hasError = !response;

            // Проверка успешности ответа
            if (hasError) {
                return <ApiResponse> {
                    statusCode: 500,
                    statusText: "Document request failed",
                    data: [],
                };
            }

            // Возврат структурированных данных
            return <ApiResponse> {
                statusCode: 200,
                statusText: 'Success',
                data: (await response.json()) ?? [],
            }
        }

        catch (error) {
            console.error("Documents fetch error:", error);
            return <ApiResponse> {
                statusCode: 500,
                statusText: "Internal Server Error",
                data: error instanceof Error ? error.message : String(error),
            };
        }
    }
})