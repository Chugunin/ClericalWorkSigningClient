<script setup lang="ts">
import * as locales from '@nuxt/ui/locale';

useHead({
  titleTemplate: (titleChunk) =>
      titleChunk ? `${titleChunk} · Clerical Work Signing` : 'Clerical Work Signing',
})

</script>

<template>
  <NuxtLoadingIndicator/>
  <UApp :locale="locales.ru" :toaster="{ position: 'top-right' }">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </UApp>
</template>

<style scoped>

</style>