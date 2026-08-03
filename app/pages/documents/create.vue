<script setup lang="ts">
import { DocumentCreateScreen } from '~/modules/document-create'

definePageMeta({
  layout: 'documents-create-layout'
})

useHead({
  title: 'Новый документ'
})

</script>

<template>
  <DocumentCreateScreen />
</template>
