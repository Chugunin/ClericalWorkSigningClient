import type { ApiResponse } from '~~/shared/types/api/api-response'
import type { DictionariesResponse } from '~~/shared/types/dictionaries/dictionaries-response'

export async function useDictionaries() {
    const { data, error, status, refresh } = await useAsyncData(
        'dictionaries',
        () => $fetch<ApiResponse<DictionariesResponse>>('/api/dictionaries'),
    )

    const dictionaries = computed<DictionariesResponse | null>(() => {
        if (!data.value?.success) {
            return null
        }

        return data.value.data
    })

    return {
        dictionaries,
        error,
        status,
        refresh,
        departments: computed(() => dictionaries.value?.SigningDepartments ?? []),
        persons: computed(() => dictionaries.value?.SigningPersons ?? []),
        fileTypes: computed(() => dictionaries.value?.SigningDocumentFileTypes ?? []),
        statusTypes: computed(() => dictionaries.value?.SigningDocumentStatusTypes ?? []),
        decisionTypes: computed(() => dictionaries.value?.SigningPersonDecisionTypes ?? []),
        rightTypes: computed(() => dictionaries.value?.SigningPersonRightTypes ?? []),
        roleTypes: computed(() => dictionaries.value?.SigningPersonRoleTypes ?? []),
        originTypes: computed(() => dictionaries.value?.SigningDocumentOriginTypes ?? []),
    }
}
