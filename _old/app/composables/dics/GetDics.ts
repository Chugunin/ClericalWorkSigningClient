import type {ApiResponse} from "#shared/types/api/api-response";
import type {SigningDocument} from "#shared/types/data/signing-document";


export default async function () {
    return useAsyncData('dictionaries', async (): Promise<ApiResponse> =>
        await $fetch<ApiResponse>('/api/dics/GetDics', {
            method: "GET",
        })
    );
}