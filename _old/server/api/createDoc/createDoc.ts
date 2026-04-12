import {ApiResponse} from "#shared/types/api/api_response";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);

    const lol = 'lol'

    const baseUrl = `${config.signingApi}/api/signing/files/SaveFile/${lol}`;

    const fetchOptions: any = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        method: "POST",
    };

    // получение всех согласуемых документов
    if (event.method === "POST") {

        try {
            const response = await fetch(baseUrl, fetchOptions)

            return <ApiResponse> {
                statusCode: response.status,
                statusText: response.statusText,
                data: (await response.json()) ?? [],
            }
        }

        catch (error) {
            console.error("Documents fetch error:", error);

            return <ApiResponse> {
                statusCode: 500,
                statusText: 'Ошибка получения данных с внешнего API',
                data: [],
            }
        }
    }
})