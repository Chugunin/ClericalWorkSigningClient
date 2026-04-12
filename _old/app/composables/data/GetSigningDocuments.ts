import type {ApiResponse} from "#shared/types/api/api-response";
import type {SigningDocument} from "#shared/types/data/signing-document";

export default async function () {
    const response = await useAsyncData('documents', async (): Promise<ApiResponse> =>
        await $fetch<ApiResponse>('/api/data/GetDocuments', {
            method: "GET",
        })
    );

    if (response?.data?.value?.statusCode === 200) {
        return ref<SigningDocument[]>(response.data.value.data ?? []);
    }

    return ref<SigningDocument[]>([]);
}