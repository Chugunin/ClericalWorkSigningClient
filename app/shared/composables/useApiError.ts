import { ApiError } from "~/shared/api/api-client"

export function useApiError() {

    function getMessage(error: unknown): string {

        if (error instanceof ApiError)
            return error.message

        if (error instanceof Error)
            return error.message

        return "Неизвестная ошибка"

    }

    return {

        getMessage

    }

}