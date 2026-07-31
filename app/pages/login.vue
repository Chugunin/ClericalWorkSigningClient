<script setup lang="ts">
// Отключаем стандартный layout, если он у тебя есть (например, с боковой панелью),
// чтобы страница логина была пустой и по центру экрана.
import {useAuthStore} from "~/stores/auth";

definePageMeta({
  layout: 'login-layout'
})

const authStore = useAuthStore()
const toast = useToast()

// Реактивное состояние формы
const state = reactive({
  login: '',
  password: ''
})

async function onSubmit() {

  // Базовая валидация на пустоту
  if (!state.login || !state.password) {
    toast.add({
      title: 'Внимание',
      description: 'Пожалуйста, введите логин и пароль',
      color: "warning"
    })
    return
  }

  try {
    await authStore.login({
      login: state.login,
      password: state.password
    })

    // Перенаправляем на главную страницу после успешного входа
    navigateTo('/')
  } catch (error: any) {
    console.error('Ошибка входа:', error)

    // Выводим красивое уведомление об ошибке через Nuxt UI
    toast.add({
      title: 'Ошибка авторизации',
      description: error?.data?.message || 'Неверный логин или пароль. Проверьте введенные данные.',
      color: 'error'
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

      <form @submit.prevent="onSubmit" class="space-y-4">

        <UFormField label="Логин" name="login">
          <UInput
              class="w-full max-w-sm"
              v-model="state.login"
              placeholder="Логин или Email"
              icon="lucide-user"
              autocomplete="username"
              :disabled="authStore.loading"
          />
        </UFormField>

        <UFormField label="Пароль" name="password">
          <UInput
              class="w-full max-w-sm"
              v-model="state.password"
              type="password"
              placeholder="••••••••"
              icon="lucide-key"
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