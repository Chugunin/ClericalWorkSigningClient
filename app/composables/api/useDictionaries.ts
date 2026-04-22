import type {ApiResponse} from '#shared/types/api/api-response'
import type {DictionariesResponse} from '#shared/types/contracts/responses/dictionaries/dictionaries-response'

export async function useDictionaries() {
    const {data, error, status, refresh} = await useAsyncData(
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
        fileTypes: computed(() => dictionaries.value?.DocumentFileTypes ?? []),
        statusTypes: computed(() => dictionaries.value?.DocumentStatusTypes ?? []),
        originTypes: computed(() => dictionaries.value?.DocumentOriginTypes ?? []),
        departments: computed(() => dictionaries.value?.Departments ?? []),
        persons: computed(() => dictionaries.value?.Persons
            ?.sort((a, b) => !a || !b ? 0 : a.Name.localeCompare(b.Name)) ?? []),
        decisionTypes: computed(() => dictionaries.value?.PersonDecisionTypes ?? []),
        rightTypes: computed(() => dictionaries.value?.PersonRightTypes ?? []),
        roleTypes: computed(() => dictionaries.value?.PersonRoleTypes ?? []),
    }
}
