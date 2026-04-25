<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const props = withDefaults(defineProps<{
  collapsed: boolean
  pendingSigningCount?: number
  myDocumentsCount?: number
}>(), {
  pendingSigningCount: 0,
  myDocumentsCount: 0,
})

const menuItems = computed<NavigationMenuItem[][]>(() => [[
  {
    search: "Private",
    label: 'Личная страница',
    icon: 'i-lucide-user-round',
    to: '/documents/private',
    badge: props.myDocumentsCount > 0
        ? {
          label: String(props.myDocumentsCount),
          color: 'warning',
          variant: 'soft',
        }
        : undefined,
    chip: props.collapsed && props.myDocumentsCount > 0
        ? {
          color: 'warning',
          inset: true,
        }
        : false,
    tooltip: props.collapsed ? {text: 'Мои документы'} : false,
  },
  {
    search: "Signing",
    label: 'Согласование',
    icon: 'i-lucide-signature',
    to: '/documents/signing',
    badge: props.pendingSigningCount > 0
        ? {
          label: String(props.pendingSigningCount),
          color: 'warning',
          variant: 'soft',
        }
        : undefined,
    chip: props.collapsed && props.pendingSigningCount > 0
        ? {
          color: 'warning',
          inset: true,
        }
        : false,
    tooltip: props.collapsed ? {text: 'Согласование'} : false,
  },
  {
    search: "SigningControl",
    label: 'Контроль согласования',
    icon: 'i-lucide-network',
    to: '/documents/control',
    tooltip: props.collapsed ? {text: 'Контроль согласования'} : false,
  }
]])

</script>

<template>
  <UNavigationMenu
      :items="menuItems"
      orientation="vertical"
      variant="link"
      highlight
      tooltip
      :collapsed="collapsed"
      class="w-full">
  </UNavigationMenu>
</template>

<style scoped>

</style>