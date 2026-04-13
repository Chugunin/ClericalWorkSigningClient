<script setup lang="ts">
import {SplitterGroup, SplitterPanel, SplitterResizeHandle} from "reka-ui";

const props = withDefaults(defineProps<{
  defaultSizes?: [number, number, number] | number[]
  minSizes?: [number?, number?, number?],
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
  layoutStateKey: "app-three-pane-shell",
  isLeftPanelResizable: true,
  isCenterPanelResizable: true,
  isRightPanelResizable: true,
  isLeftPanelCollapsible: true,
  isCenterPanelCollapsible: true,
  isRightPanelCollapsible: true,
  isRightPanelEnabled: true,
});

const layout = useState<number[] | null>(`splitter:layout:${props.layoutStateKey}`, () => null);

const defaultSizes = computed(() => normalizeLayout(props.defaultSizes));
const minSizes = computed(() => normalizeMinSizes(props.minSizes));
const panelSizes = computed(() => normalizeLayout(layout.value ?? defaultSizes.value));

const leftPanel = useTemplateRef("leftPanelRef");
const centerPanel = useTemplateRef("centerPanelRef");
const rightPanel = useTemplateRef("rightPanelRef");

function toggleLeftPanel() {
  if (!props.isLeftPanelCollapsible)
    return;

  if (leftPanel.value?.isCollapsed)
    leftPanel.value?.expand();
  else
    leftPanel.value?.collapse();
}

function toggleCenterPanel() {
  if (!props.isCenterPanelCollapsible)
    return;

  if (centerPanel.value?.isCollapsed)
    centerPanel.value?.expand();
  else
    centerPanel.value?.collapse();
}

function toggleRightPanel() {
  if (!props.isRightPanelCollapsible)
    return;

  if (rightPanel.value?.isCollapsed)
    rightPanel.value?.expand();
  else
    rightPanel.value?.collapse();
}

function onLayout(value: number[]) {
  layout.value = normalizeLayout(value);
}

function normalizeLayout(value: number[]) {
  const fallback = [40, 30, 30]

  const sizes = value.length === 3
      ? value.map((size) => Number.isFinite(size) && size >= 0 ? size : 0)
      : fallback;

  const total = sizes.reduce((sum, size) => sum + size, 0);

  if (total <= 0)
    return fallback;

  return sizes.map((size) => size / total * 100);
}

function normalizeMinSizes(value: [number?, number?, number?]) {
  return [value[0], value[1], value[2]].map((size) => {
    if (!Number.isFinite(size))
      return undefined;

    return Math.min(Math.max(size as number, 0), 100);
  });
}

</script>

<template>
  <SplitterGroup
      class="h-full min-h-0 w-full overflow-hidden"
      direction="horizontal"
      @layout="onLayout">

    <SplitterPanel
        ref="leftPanelRef"
        class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="panelSizes[0]"
        :min-size="minSizes[0]"
        :collapsible="isLeftPanelCollapsible">
      <slot name="left-panel"/>
    </SplitterPanel>

    <SplitterResizeHandle
        class="relative flex items-center justify-center w-1 m-1 bg-accented cursor-col-resize"
        :disabled="!isLeftPanelResizable || !isCenterPanelResizable"
        :class="[!isLeftPanelResizable || !isCenterPanelResizable ? 'cursor-default' : '']">

      <div
          class="absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-auto"
          @mousedown.stop
          @mouseenter.stop
          @mouseleave.stop>

        <UButton
            :class="[isLeftPanelCollapsible ? 'flex' : 'hidden']"
            class="p-0! w-3! h-16 items-center justify-center rounded-r-md shadow-sm cursor-pointer!"
            color="neutral"
            variant="outline"
            @click.stop="toggleLeftPanel">
          <UIcon
              class="cursor-pointer!"
              :name="leftPanel?.isCollapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"/>
        </UButton>

        <UButton
            :class="[isCenterPanelCollapsible && isLeftPanelCollapsible ? 'flex' : 'hidden']"
            class="p-0! w-3! h-16 items-center justify-center rounded-r-md shadow-sm cursor-pointer!"
            color="neutral"
            variant="outline"
            @click.stop="toggleCenterPanel">
          <UIcon
              class="cursor-pointer!"
              :name="centerPanel?.isCollapsed ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"/>
        </UButton>

      </div>

    </SplitterResizeHandle>

    <SplitterPanel
        ref="centerPanelRef"
        class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="panelSizes[1]"
        :min-size="minSizes[1]"
        :collapsible="isCenterPanelCollapsible">
      <slot name="center-panel"/>
    </SplitterPanel>

    <SplitterResizeHandle
        class="relative flex items-center justify-center w-1 m-1 bg-accented cursor-col-resize"
        :disabled="!isCenterPanelResizable || !isRightPanelResizable"
        :class="[!isCenterPanelResizable || !isRightPanelResizable ? 'cursor-default' : '']"
        v-if="isRightPanelEnabled">

      <div
          class="absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-auto"
          @mousedown.stop
          @mouseenter.stop
          @mouseleave.stop>

        <UButton
            :class="[isCenterPanelCollapsible && isRightPanelCollapsible ? 'flex' : 'hidden']"
            class="p-0! w-3! h-16 items-center justify-center rounded-r-md shadow-sm cursor-pointer!"
            color="neutral"
            variant="outline"
            @click.stop="toggleCenterPanel">
          <UIcon
              class="cursor-pointer!"
              :name="centerPanel?.isCollapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"/>
        </UButton>

        <UButton
            :class="[isRightPanelCollapsible ? 'flex' : 'hidden']"
            class="p-0! w-3! h-16 items-center justify-center rounded-r-md shadow-sm cursor-pointer!"
            color="neutral"
            variant="outline"
            @click.stop="toggleRightPanel">
          <UIcon
              class="cursor-pointer!"
              :name="rightPanel?.isCollapsed ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"/>
        </UButton>

      </div>

    </SplitterResizeHandle>

    <SplitterPanel
        ref="rightPanelRef"
        class="flex h-full min-h-0 min-w-0 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="panelSizes[2]"
        :min-size="minSizes[2]"
        :collapsible="isRightPanelCollapsible"
        v-if="isRightPanelEnabled">
      <slot name="right-panel"/>
    </SplitterPanel>

  </SplitterGroup>
</template>

<style scoped>

</style>
