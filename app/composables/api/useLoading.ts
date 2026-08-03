export function useLoading() {

    const loading = ref(false)

    async function execute<T>(
        action: () => Promise<T>
    ): Promise<T> {

        loading.value = true

        try {

            return await action()

        }
        finally {

            loading.value = false

        }

    }

    return {

        loading,

        execute

    }

}