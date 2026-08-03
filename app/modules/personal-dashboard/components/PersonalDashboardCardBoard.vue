<script setup lang="ts">

import type { PersonalDashboardCard } from '../types/personal-dashboard-card'

const props = withDefaults(defineProps<{
  documentCards: PersonalDashboardCard[]
  loading?: boolean
}>(), {
  loading: false
})

</script>

<template>
  <div class="h-full min-h-0 overflow-y-auto overflow-x-hidden">

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2">
      <UCard
          v-for="documentCard in documentCards"
          :key="documentCard.id"
          class="mb-4 min-w-0"
          :class="['border', documentCard.statusColor.borderClass]"
      >
        <template #header>
          <div class="flex flex-col gap-0.5 justify-stretch">

            <div class="font-medium truncate">
              {{ documentCard.name }}
            </div>

            <div class="font-medium text-muted">
              от {{ documentCard.dateText }}
            </div>

            <UBadge variant="solid" class="justify-center"
                    :class="[documentCard.statusColor.bgClass, documentCard.statusColor.textClass]">
              <span class="font-bold text-sm">{{ documentCard.statusText }}</span>
            </UBadge>

          </div>
        </template>

        <div class="flex flex-col justify-start gap-2 whitespace-pre-line wrap-break-word">

          <div class="flex flex-col">
            <span>Описание:</span>
            <span class="text-sm text-muted">
                  {{ documentCard.description ?? '[пусто]' }}
                </span>
          </div>

        </div>

      </UCard>
    </div>

    <!--    <template #fallback>
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <USkeleton
                v-for="i in 8"
                :key="i"
                class="h-48 w-full rounded-xl"
            />
          </div>
        </template>-->

  </div>
</template>