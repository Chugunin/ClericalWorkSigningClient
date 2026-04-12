<script setup lang="ts">
import {SplitterGroup, SplitterPanel, SplitterResizeHandle} from "reka-ui";

/*const layout = useCookie<number[]>('splitter:layout')*/

const isLeftPanelCollapsible = defineModel("isLeftPanelCollapsible", {default: true});
const isRightPanelCollapsible = defineModel("isRightPanelCollapsible", {default: true});

const leftPanel = useTemplateRef("leftPanelRef");
const rightPanel = useTemplateRef("rightPanelRef");

function toggleLeftPanel() {
  if (leftPanel.value?.isCollapsed)
    leftPanel.value?.expand();
  else
    leftPanel.value?.collapse();
}

function toggleRightPanel() {
  if (rightPanel.value?.isCollapsed)
    rightPanel.value?.expand();
  else
    rightPanel.value?.collapse();
}

</script>

<template>
  <SplitterGroup
      class="h-full min-h-0 w-full overflow-hidden"
      direction="horizontal">

    <SplitterPanel
        ref="leftPanelRef"
        class="flex h-full min-h-0 min-w-1/3 flex-col items-stretch gap-2 overflow-hidden p-2"
        :default-size="70"
        :collapsible="true">
      <slot name="left-panel"/>
    </SplitterPanel>

    <SplitterResizeHandle
        class="relative flex items-center justify-center w-1 m-1 bg-accented cursor-col-resize">

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
        :default-size="30"
        :collapsible="true">
      <slot name="right-panel"/>
    </SplitterPanel>

  </SplitterGroup>
</template>

<style scoped>

</style>
