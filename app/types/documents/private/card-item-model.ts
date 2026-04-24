import type {DocumentStatusColor} from "~/utils/color";

export interface DocumentCardItem {
    id: string
    name: string
    date?: Date
    dateText?: string
    description?: string
    statusText?: string
    statusColor: DocumentStatusColor
    originText?: string
    executorText?: string
}
