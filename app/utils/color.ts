import colors from 'tailwindcss/colors'

export function randomizeDefaultColor() {
    const colors = ['primary', 'secondary', 'warning', 'error']
    return colors[Math.floor(Math.random() * colors.length)]
}

export function getCssColor(varName: string, element: HTMLElement = document.documentElement) {
    return getComputedStyle(element)
        .getPropertyValue(varName)
        .trim()
}

function withOpacity(color: string, opacity: number) {
    if (color.startsWith('oklch(')) {
        return color.replace(')', ` / ${opacity})`)
    }
    return color
}


export type DocumentStatusColor = {
    bgClass: string
    textClass: string
    borderClass: string
    chartColor: string
}

const documentStatusColors: Record<number, DocumentStatusColor> = {
    1: {
        bgClass: 'bg-blue-500/90',
        textClass: 'text-inverted',
        borderClass: 'border-blue-500/90',
        chartColor: withOpacity(colors.blue[500], 0.9)
    },//created
    2: {
        bgClass: 'bg-yellow-500',
        textClass: 'text-inverted',
        borderClass: 'border-yellow-500/90',
        chartColor: withOpacity(colors.yellow[500], 0.9)
    },//submitted
    3: {
        bgClass: 'bg-green-500/90',
        textClass: 'text-inverted',
        borderClass: 'border-green-500/90',
        chartColor: withOpacity(colors.green[500], 0.9)
    },//reviewed
    4: {
        bgClass: 'bg-red-500/90',
        textClass: 'text-inverted',
        borderClass: 'border-red-500/90',
        chartColor: withOpacity(colors.red[500], 0.9)
    },//refused
    5: {
        bgClass: 'bg-emerald-500/90',
        textClass: 'text-inverted',
        borderClass: 'border-emerald-500/90',
        chartColor: withOpacity(colors.emerald[500], 0.9)
    },//signed
    6: {
        bgClass: 'bg-amber-600',
        textClass: 'text-inverted',
        borderClass: 'border-amber-600/90',
        chartColor: withOpacity(colors.amber[600], 0.9)
    },//submittedToDirector
    7: {
        bgClass: 'bg-green-800/90',
        textClass: 'text-inverted',
        borderClass: 'border-green-800/90',
        chartColor: withOpacity(colors.green[800], 0.9)
    },//reviewedByDirector
    8: {
        bgClass: 'bg-red-800',
        textClass: 'text-inverted',
        borderClass: 'border-red-800/90',
        chartColor: withOpacity(colors.red[800], 0.9)
    },//refusedByDirector
    9: {
        bgClass: 'bg-emerald-800',
        textClass: 'text-inverted',
        borderClass: 'border-emerald-800/90',
        chartColor: withOpacity(colors.emerald[800], 0.9)
    },//signedByDirector
    0: {
        bgClass: 'bg-gray-400/90',
        textClass: 'text-inverted',
        borderClass: 'border-gray-400/90',
        chartColor: withOpacity(colors.gray[400], 0.9)
    },//default
}

export function getDocumentStatusColor(statusId?: number | null) {
    if (!statusId) {
        return documentStatusColors[0]!
    }

    return (documentStatusColors[statusId] ?? documentStatusColors[0])!
}