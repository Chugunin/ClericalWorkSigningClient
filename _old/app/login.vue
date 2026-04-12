<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui';
import { useAuthStore } from "~/stores/auth";
import type { IAuthCredentials } from "~/types/auth";

definePageMeta({
  layout: 'login',
})

const authStore = useAuthStore();

const fields: AuthFormField[] = [
  {
    name: 'login',
    type: 'text',
    label: 'Логин',
    placeholder: '',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: 'Пароль',
    placeholder: '',
    required: true,
  },
];

const submit = {
  label: 'Далее',
  block: true,
}

async function onSubmit(credentials:FormSubmitEvent<IAuthCredentials>) {
  const { login, password } = credentials.data;
  try {
    await authStore.login(login, password);
    if (authStore.user.isAuthenticated) {
      await navigateTo('/');
    }
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <UAuthForm
      title="Авторизация"
      description="Введите данные учетной записи в локальной вычислительной сети ГУК МО РФ"
      icon="i-lucide-user"
      :fields="fields"
      :submit="submit"
      @submit="onSubmit">
  </UAuthForm>
</template>

<style scoped>

</style>