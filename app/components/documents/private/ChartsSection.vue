<script setup lang="ts">

import {ArcElement, Chart, type ChartData, type ChartOptions, Legend, PieController, Tooltip} from "chart.js";
import type {DocumentChartItem} from "~/types/documents/private/chart-item-model";

Chart.register(PieController, ArcElement, Tooltip, Legend)

const props = defineProps<{
  items: DocumentChartItem[]
  hiddenStatusIds: number[]
}>()

const emit = defineEmits<{
  legendClick: [
    payload: {
      statusId: number
      label: string
      index: number
    }
  ]
}>()

const colorMode = useColorMode()
const colorProbeRef = ref<HTMLElement | null>(null)
const legendFontColor = ref('currentColor')

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart<'pie'> | null = null

const chartData = computed<ChartData<'pie'>>(() => ({
  labels: props.items.map(x => x.label),
  datasets: [
    {
      label: 'Документы',
      data: props.items.map(x => x.count),
      backgroundColor: props.items.map(x => x.color.chartColor ?? '#999999'),
      borderWidth: 2,
    }
  ]
}))

const chartOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  devicePixelRatio: 2,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: legendFontColor.value,
      },
      onClick(e, legendItem) {
        const index = legendItem.index

        if (index === undefined) {
          return
        }

        const item = props.items[index]

        if (!item) {
          return
        }

        emit('legendClick', {
          statusId: item.statusId,
          label: item.label,
          index,
        })
      }
    },
    tooltip: {
      callbacks: {
        label(context) {
          const label = context.label ?? ''
          const value = context.parsed ?? 0

          return `${label}: ${value}`
        }
      }
    }
  }
}

function syncHiddenStatuses(update = true) {
  if (!chart) {
    return
  }

  props.items.forEach((item, index) => {
    const shouldBeVisible = !props.hiddenStatusIds.includes(item.statusId)
    const isVisible = chart!.getDataVisibility(index)

    if (shouldBeVisible !== isVisible) {
      chart!.toggleDataVisibility(index)
    }
  })

  if (update) {
    chart.update('none')
  }
}

watch(
    () => props.hiddenStatusIds,
    () => {
      syncHiddenStatuses(true)
    },
    { deep: true }
)

function renderChart() {
  if (!canvasRef.value) {
    return
  }

  chart = new Chart(canvasRef.value, {
    type: 'pie',
    data: chartData.value,
    options: chartOptions
  })
}

function updateChart() {
  if (!chart) {
    return
  }

  chart.data.labels = chartData.value.labels
  chart.data.datasets = chartData.value.datasets

  syncHiddenStatuses(false)

  chart.update('none')
}

function readLegendColor() {
  if (!colorProbeRef.value) {
    return
  }

  legendFontColor.value = getComputedStyle(colorProbeRef.value).color
}

function applyLegendColor() {
  if (!chart) {
    return
  }

  chart.options.plugins!.legend!.labels!.color = legendFontColor.value
  chart.options.borderColor = legendFontColor.value
  chart.update('none')
}

onMounted(async () => {
  await nextTick()

  readLegendColor()

  renderChart()

  applyLegendColor()
})

watch(chartData, () => {
  updateChart()
}, {deep: true})

watch(legendFontColor, () => {
  applyLegendColor()
})

watch(() => colorMode.value,
    async () => {
      await nextTick()
      readLegendColor()
    }
)

onBeforeUnmount(() => {
  chart?.destroy()
  chart = null
})

</script>

<template>

  <span
      ref="colorProbeRef"
      class="text-default hidden"
  />

  <div class="relative w-full h-full min-h-[260px]">
    <canvas ref="canvasRef"/>
  </div>

</template>

<style scoped>

</style>