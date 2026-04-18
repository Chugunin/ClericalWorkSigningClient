export type AppToastLevel = 'error' | 'warning' | 'info' | 'success'

export interface AppToastMessage {
    text: string
    level: AppToastLevel
}

const LEVEL_META = {
    error: {
        title: 'Ошибка',
        color: 'error',
        icon: 'i-lucide-circle-alert',
    },
    warning: {
        title: 'Предупреждение',
        color: 'warning',
        icon: 'i-lucide-circle-alert',
    },
    info: {
        title: 'Информация',
        color: 'info',
        icon: 'i-lucide-circle-alert',
    },
    success: {
        title: 'Успешно',
        color: 'success',
        icon: 'i-lucide-circle-check',
    },
} as const

export function useAppToast() {
    const toast = useToast()

    function show(message: AppToastMessage, duration = 3000, useProgress = false) {
        const meta = LEVEL_META[message.level]
        const id = Date.now().toString()

        toast.add({
            id: id,
            title: meta.title,
            description: message.text,
            color: meta.color,
            icon: meta.icon,
            duration: useProgress ? duration : 0,
            close: true,
            progress: useProgress,
        })

        if (!useProgress) {
            setTimeout(() => {
                toast.remove(id)
            }, duration)  
        }
    }

    function showMany(messages: AppToastMessage[]) {
        messages.forEach(m => show(m))
    }

    function error(text: string) {
        show({text, level: 'error'})
    }

    function warning(text: string) {
        show({text, level: 'warning'})
    }

    function info(text: string) {
        show({text, level: 'info'})
    }

    function success(text: string) {
        show({text, level: 'success'})
    }

    function remove(id: (string | number)) {
        toast.remove(id)
    }

    function clear() {
        toast.clear()
    }

    return {
        show,
        showMany,
        error,
        warning,
        info,
        success,
        remove,
        clear,
    }
}