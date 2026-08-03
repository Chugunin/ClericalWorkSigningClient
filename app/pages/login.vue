<script setup lang="ts">
import { AuthLoginScreen } from '~/modules/auth'

definePageMeta({
  layout: 'login-layout',
})

useHead({
  title: 'Вход',
})
</script>

<template>
  <AuthLoginScreen />
</template>
