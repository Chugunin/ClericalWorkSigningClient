import type {ComputedSetter} from "vue";

export interface DocumentCardModel {
    id: string
    name: string
    date?: string
    description?: string
    statusText?: string
    originText?: string
    executorText?: string
    headerColor?: string
}
