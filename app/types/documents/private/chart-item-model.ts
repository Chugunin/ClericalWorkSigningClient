import type {DocumentStatusColor} from "~/utils/color";

export interface DocumentChartItem {
    statusId: number
    label: string
    count: number
    color: DocumentStatusColor
}