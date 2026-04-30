<script setup lang="ts">
import {SplitterGroup, SplitterPanel, SplitterResizeHandle} from 'reka-ui'

const props = withDefaults(defineProps<{
  defaultSizes?: [number, number, number] | number[]
  minSizes?: [number?, number?, number?]
  maxSizes?: [number?, number?, number?]
  layoutStateKey?: string
  isLeftPanelResizable?: boolean
  isCenterPanelResizable?: boolean
  isRightPanelResizable?: boolean
  isLeftPanelCollapsible?: boolean
  isCenterPanelCollapsible?: boolean
  isRightPanelCollapsible?: boolean
  isRightPanelEnabled?: boolean
}>(), {
  defaultSizes: () => [40, 30, 30],
  minSizes: () => [undefined, 30, undefined],
  maxSizes: () => [undefined, 100, undefined],
  layoutStateKey: 'app-three-pane-shell',
  isLeftPanelResizable: true,
  isCenterPanelResizable: true,
  isRightPanelResizable: true,
  isLeftPanelCollapsible: true,
  isCenterPanelCollapsible: true,
  isRightPanelCollapsible: true,
  isRightPanelEnabled: true,
})

const layout = useState<number[] | null>(
    `splitter:layout:${props.layoutStateKey}`,
    () => null,
)

const fallbackLayout = computed(() => {
  return props.isRightPanelEnabled
      ? normalizeLayout(props.defaultSizes)
      : normalizeLayout(props.defaultSizes.slice(0, 2))
})

const fallbackGridColumns = computed(() => {
  const columns: string[] = []

  fallbackLayout.value.forEach((size, index) => {
    // сама панель
    columns.push(`${size}fr`)

    // handle между панелями
    if (index < fallbackLayout.value.length - 1) {
      columns.push('0.25rem')
    }
  })

  return columns.join(' ')
})

const isMounted = ref(false)
const initialLayout = ref<number[]>([])

const panelsCount = computed(() => props.isRightPanelEnabled ? 3 : 2)

const minSizes = computed(() => normalizeSizes(props.minSizes))
const maxSizes = computed(() => normalizeSizes(props.maxSizes))

const splitterKey = computed(() => [
  props.layoutStateKey,
  props.isRightPanelEnabled ? 'with-right' : 'without-right',
  initialLayout.value.join('-'),
].join(':'))

const leftPanel = useTemplateRef('leftPanelRef')
const centerPanel = useTemplateRef('centerPanelRef')
const rightPanel = useTemplateRef('rightPanelRef')

onMounted(async () => {
  const sourceLayout = layout.value ?? props.defaultSizes

  initialLayout.value = normalizeLayout(
      props.isRightPanelEnabled
          ? sourceLayout
          : sourceLayout.slice(0, 2),
  )

  await nextTick()

  isMounted.value = true

  await nextTick()

  if (props.isRightPanelEnabled && initialLayout.value[2] === 0) {
    rightPanel.value?.collapse()
  }
})

function toggleLeftPanel() {
  if (!props.isLeftPanelCollapsible)
    return

  if (leftPanel.value?.isCollapsed)
    leftPanel.value.expand()
  else
    leftPanel.value?.collapse()
}

function toggleCenterPanel() {
  if (!props.isCenterPanelCollapsible)
    return

  if (centerPanel.value?.isCollapsed)
    centerPanel.value.expand()
  else
    centerPanel.value?.collapse()
}

function toggleRightPanel() {
  if (!props.isRightPanelCollapsible)
    return

  if (rightPanel.value?.isCollapsed)
    rightPanel.value.expand()
  else
    rightPanel.value?.collapse()
}

function onLayout(value: number[]) {
  if (!isMounted.value)
    return

  if (value.length !== panelsCount.value)
    return

  layout.value = normalizeLayout(value)
}

function normalizeLayout(value: number[]) {
  const fallback = props.isRightPanelEnabled
      ? [40, 30, 30]
      : [40, 60]

  const sizes = value.length === fallback.length
      ? value.map((size) => Number.isFinite(size) && size >= 0 ? size : 0)
      : fallback

  const total = sizes.reduce((sum, size) => sum + size, 0)

  if (total <= 0)
    return fallback

  return sizes.map((size) => size / total * 100)
}

function normalizeSizes(value: [number?, number?, number?]) {
  return [value[0], value[1], value[2]].map((size) => {
    if (!Number.isFinite(size))
      return undefined

    return Math.min(Math.max(size as number, 0), 100)
  })
}
</script>

<template>
  <SplitterGroup
      v-if="isMounted"
      :key="splitterKey"
      class="h-full min-h-0 w-full overflow-hidden"
      direction="horizontal"
      @layout="onLayout"
  >
    <SplitterPanel
        ref="leftPanelRef"
        class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="initialLayout[0]"
        :min-size="minSizes[0]"
        :max-size="maxSizes[0]"
        :collapsible="isLeftPanelCollapsible"
    >
      <slot name="left-panel"/>
    </SplitterPanel>

    <SplitterResizeHandle
        class="relative m-1 flex w-1 cursor-col-resize items-center justify-center bg-accented"
        :disabled="!isLeftPanelResizable || !isCenterPanelResizable"
        :class="[!isLeftPanelResizable || !isCenterPanelResizable ? 'cursor-default' : '']"
    >
      <div
          class="pointer-events-auto absolute top-1/2 z-20 flex -translate-y-1/2 flex-col items-center justify-center"
          @mousedown.stop
          @mouseenter.stop
          @mouseleave.stop
      >
        <UButton
            :class="[isLeftPanelCollapsible ? 'flex' : 'hidden']"
            class="h-16! w-3! cursor-pointer! items-center justify-center rounded-r-md p-0! shadow-sm"
            color="neutral"
            variant="outline"
            @click.stop="toggleLeftPanel"
        >
          <UIcon
              class="cursor-pointer!"
              :name="leftPanel?.isCollapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
          />
        </UButton>

        <UButton
            :class="[isCenterPanelCollapsible && isLeftPanelCollapsible ? 'flex' : 'hidden']"
            class="h-16! w-3! cursor-pointer! items-center justify-center rounded-r-md p-0! shadow-sm"
            color="neutral"
            variant="outline"
            @click.stop="toggleCenterPanel"
        >
          <UIcon
              class="cursor-pointer!"
              :name="centerPanel?.isCollapsed ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
          />
        </UButton>
      </div>
    </SplitterResizeHandle>

    <SplitterPanel
        ref="centerPanelRef"
        class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="initialLayout[1]"
        :min-size="minSizes[1]"
        :max-size="maxSizes[1]"
        :collapsible="isCenterPanelCollapsible"
    >
      <slot name="center-panel"/>
    </SplitterPanel>

    <SplitterResizeHandle
        v-if="isRightPanelEnabled"
        class="relative m-1 flex w-1 cursor-col-resize items-center justify-center bg-accented"
        :disabled="!isCenterPanelResizable || !isRightPanelResizable"
        :class="[!isCenterPanelResizable || !isRightPanelResizable ? 'cursor-default' : '']"
    >
      <div
          class="pointer-events-auto absolute top-1/2 z-20 flex -translate-y-1/2 flex-col items-center justify-center"
          @mousedown.stop
          @mouseenter.stop
          @mouseleave.stop
      >
        <UButton
            :class="[isCenterPanelCollapsible && isRightPanelCollapsible ? 'flex' : 'hidden']"
            class="h-16! w-3! cursor-pointer! items-center justify-center rounded-r-md p-0! shadow-sm"
            color="neutral"
            variant="outline"
            @click.stop="toggleCenterPanel"
        >
          <UIcon
              class="cursor-pointer!"
              :name="centerPanel?.isCollapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
          />
        </UButton>

        <UButton
            :class="[isRightPanelCollapsible ? 'flex' : 'hidden']"
            class="h-16! w-3! cursor-pointer! items-center justify-center rounded-r-md p-0! shadow-sm"
            color="neutral"
            variant="outline"
            @click.stop="toggleRightPanel"
        >
          <UIcon
              class="cursor-pointer!"
              :name="rightPanel?.isCollapsed ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
          />
        </UButton>
      </div>
    </SplitterResizeHandle>

    <SplitterPanel
        v-if="isRightPanelEnabled"
        ref="rightPanelRef"
        class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="initialLayout[2]"
        :min-size="minSizes[2]"
        :max-size="maxSizes[2]"
        :collapsible="isRightPanelCollapsible"
    >
      <slot name="right-panel"/>
    </SplitterPanel>

  </SplitterGroup>

  <div
      v-else
      class="flex h-full min-h-0 w-full overflow-hidden"
  >
    <template v-for="(size, index) in fallbackLayout" :key="index">
      <div
          class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
          :style="{ flexBasis: `${size}%`, flexGrow: size, flexShrink: 1 }"
      >
        <USkeleton class="h-full w-full rounded-lg"/>
      </div>

      <div
          v-if="index < fallbackLayout.length - 1"
          class="relative m-1 flex w-1 shrink-0 items-center justify-center bg-accented"
      />
    </template>
  </div>
</template>