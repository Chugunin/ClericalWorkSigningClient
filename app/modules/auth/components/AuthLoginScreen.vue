<script setup lang="ts">
import { reactive } from 'vue'
import { navigateTo, useToast } from '#imports'

import { useApplicationBootstrap } from '~/app/bootstrap'

import { getAuthErrorMessage } from '../lib/auth-error'
import { useAuthStore } from '../model/auth.store'

const authStore = useAuthStore()
const bootstrap = useApplicationBootstrap()
const toast = useToast()

const state = reactive({
  login: '',
  password: '',
})

async function onSubmit() {
  if (!state.login || !state.password) {
    toast.add({
      title: 'Внимание',
      description: 'Пожалуйста, введите логин и пароль',
      color: 'warning',
    })
    return
  }

  try {
    await authStore.login({
      login: state.login,
      password: state.password,
    })
    await bootstrap.refreshStartupData()
    await navigateTo('/')
  }
  catch (error: unknown) {
    toast.add({
      title: 'Ошибка авторизации',
      description: getAuthErrorMessage(error),
      color: 'error',
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Вход в систему
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Введите данные для доступа к документам
          </p>
        </div>
      </template>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Логин" name="login">
          <UInput
            v-model="state.login"
            class="w-full max-w-sm"
            placeholder="Логин или Email"
            icon="i-lucide-user"
            autocomplete="username"
            :disabled="authStore.loading"
          />
        </UFormField>

        <UFormField label="Пароль" name="password">
          <UInput
            v-model="state.password"
            class="w-full max-w-sm"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-key"
            autocomplete="current-password"
            :disabled="authStore.loading"
          />
        </UFormField>

        <div class="pt-2">
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            block
            :loading="authStore.loading"
          >
            Войти
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
