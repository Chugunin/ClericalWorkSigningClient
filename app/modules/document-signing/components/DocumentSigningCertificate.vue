<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import type { SigningCertificate } from '#shared/contracts/document-signing/certificate.contracts'

import { useAuthStore } from '~/modules/auth'
import { ApiError } from '~/shared/api'

import { DocumentSigningApi } from '../api/document-signing.api'

const toast = useToast()
const authStore = useAuthStore()

const certificate = ref<SigningCertificate | null>(null)
const isLoading = ref(false)
const isCreating = ref(false)
const isRevoking = ref(false)
const errorMessage = ref<string | null>(null)
const showCreateForm = ref(false)
const showRevokeForm = ref(false)
const revokeReason = ref('')

const createForm = reactive({
  organization: 'Система ЭДО',
  department: 'Отдел согласования',
  country: 'RU',
})

const currentUserName = computed(() => (
  authStore.user?.FullName?.trim()
  || authStore.user?.Login?.trim()
  || ''
))

const canCreate = computed(() => (
  currentUserName.value.length > 0
  && createForm.organization.trim().length > 0
  && createForm.department.trim().length > 0
  && createForm.country.trim().length === 2
  && !isCreating.value
))

const canRevoke = computed(() => (
  certificate.value !== null
  && revokeReason.value.trim().length > 0
  && !isRevoking.value
))

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
  }).format(date)
}

function normalizeError(error: unknown, fallback: string): string {
  return error instanceof Error && error.message
    ? error.message
    : fallback
}

async function loadCertificate(): Promise<void> {
  isLoading.value = true
  errorMessage.value = null

  try {
    certificate.value = await DocumentSigningApi.getCurrentCertificate()
  }
  catch (error: unknown) {
    if (error instanceof ApiError && error.status === 404) {
      certificate.value = null
      return
    }

    certificate.value = null
    errorMessage.value = normalizeError(
      error,
      'Не удалось получить сведения о сертификате.',
    )
  }
  finally {
    isLoading.value = false
  }
}

async function createCertificate(): Promise<void> {
  if (!canCreate.value) {
    return
  }

  isCreating.value = true
  errorMessage.value = null

  try {
    certificate.value = await DocumentSigningApi.createCertificate({
      commonName: currentUserName.value,
      organization: createForm.organization.trim(),
      department: createForm.department.trim(),
      country: createForm.country.trim().toUpperCase(),
    })

    showCreateForm.value = false
    toast.add({
      title: 'Сертификат выпущен',
      description: 'Новый сертификат электронной подписи успешно создан.',
      color: 'success',
    })
  }
  catch (error: unknown) {
    errorMessage.value = normalizeError(
      error,
      'Не удалось выпустить сертификат.',
    )

    toast.add({
      title: 'Ошибка выпуска сертификата',
      description: errorMessage.value,
      color: 'error',
    })
  }
  finally {
    isCreating.value = false
  }
}

async function revokeCertificate(): Promise<void> {
  const currentCertificate = certificate.value

  if (!currentCertificate || !canRevoke.value) {
    return
  }

  isRevoking.value = true
  errorMessage.value = null

  try {
    await DocumentSigningApi.revokeCertificate(
      currentCertificate.id,
      { reason: revokeReason.value.trim() },
    )

    revokeReason.value = ''
    showRevokeForm.value = false

    toast.add({
      title: 'Сертификат отозван',
      description: 'Состояние сертификата будет обновлено.',
      color: 'success',
    })

    await loadCertificate()
  }
  catch (error: unknown) {
    errorMessage.value = normalizeError(
      error,
      'Не удалось отозвать сертификат.',
    )

    toast.add({
      title: 'Ошибка отзыва сертификата',
      description: errorMessage.value,
      color: 'error',
    })
  }
  finally {
    isRevoking.value = false
  }
}

onMounted(loadCertificate)
</script>

<template>
  <div class="h-full min-h-0 overflow-y-auto p-5">
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <section class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-highlighted">
            Сертификат электронной подписи
          </h2>
          <p class="mt-1 text-sm text-muted">
            Просмотр активного сертификата, выпуск нового и отзыв текущего сертификата.
          </p>
        </div>

        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="soft"
          :loading="isLoading"
          @click="loadCertificate"
        >
          Обновить
        </UButton>
      </section>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        icon="i-lucide-circle-alert"
        title="Операция не выполнена"
        :description="errorMessage"
      />

      <UCard v-if="isLoading && !certificate">
        <div class="flex items-center gap-3 text-sm text-muted">
          <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
          Загрузка сведений о сертификате…
        </div>
      </UCard>

      <UCard v-else-if="certificate">
        <div class="space-y-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-sm text-muted">
                Субъект
              </p>
              <p class="mt-1 font-medium text-highlighted">
                {{ certificate.subject }}
              </p>
            </div>

            <UBadge color="success" variant="soft">
              {{ certificate.status }}
            </UBadge>
          </div>

          <dl class="grid gap-3 text-sm sm:grid-cols-2">
            <div class="rounded-md bg-elevated p-3">
              <dt class="text-muted">Серийный номер</dt>
              <dd class="mt-1 break-all font-mono text-xs text-highlighted">
                {{ certificate.serialNumber }}
              </dd>
            </div>

            <div class="rounded-md bg-elevated p-3">
              <dt class="text-muted">Отпечаток</dt>
              <dd class="mt-1 break-all font-mono text-xs text-highlighted">
                {{ certificate.thumbprint }}
              </dd>
            </div>

            <div class="rounded-md bg-elevated p-3">
              <dt class="text-muted">Действителен с</dt>
              <dd class="mt-1 font-medium text-highlighted">
                {{ formatDate(certificate.validFrom) }}
              </dd>
            </div>

            <div class="rounded-md bg-elevated p-3">
              <dt class="text-muted">Действителен по</dt>
              <dd class="mt-1 font-medium text-highlighted">
                {{ formatDate(certificate.validTo) }}
              </dd>
            </div>
          </dl>

          <div class="border-t border-default pt-4">
            <UButton
              v-if="!showRevokeForm"
              icon="i-lucide-ban"
              color="error"
              variant="soft"
              @click="showRevokeForm = true"
            >
              Отозвать сертификат
            </UButton>

            <div v-else class="space-y-3">
              <UFormField label="Причина отзыва" required>
                <UTextarea
                  v-model="revokeReason"
                  :rows="3"
                  placeholder="Укажите причину отзыва сертификата"
                />
              </UFormField>

              <div class="flex flex-wrap gap-2">
                <UButton
                  color="error"
                  icon="i-lucide-ban"
                  :loading="isRevoking"
                  :disabled="!canRevoke"
                  @click="revokeCertificate"
                >
                  Подтвердить отзыв
                </UButton>
                <UButton
                  color="neutral"
                  variant="ghost"
                  :disabled="isRevoking"
                  @click="showRevokeForm = false; revokeReason = ''"
                >
                  Отмена
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <UCard v-else>
        <div class="space-y-4">
          <UAlert
            color="neutral"
            variant="soft"
            icon="i-lucide-badge-x"
            title="Активный сертификат не найден"
            description="Для подписания документов необходимо выпустить сертификат электронной подписи."
          />

          <UButton
            v-if="!showCreateForm"
            icon="i-lucide-badge-plus"
            @click="showCreateForm = true"
          >
            Выпустить сертификат
          </UButton>

          <div v-else class="grid gap-4 sm:grid-cols-2">
            <UFormField label="Владелец">
              <UInput :model-value="currentUserName" disabled />
            </UFormField>

            <UFormField label="Страна" required>
              <UInput v-model="createForm.country" maxlength="2" />
            </UFormField>

            <UFormField label="Организация" required>
              <UInput v-model="createForm.organization" />
            </UFormField>

            <UFormField label="Подразделение" required>
              <UInput v-model="createForm.department" />
            </UFormField>

            <div class="flex flex-wrap gap-2 sm:col-span-2">
              <UButton
                icon="i-lucide-badge-plus"
                :loading="isCreating"
                :disabled="!canCreate"
                @click="createCertificate"
              >
                Выпустить сертификат
              </UButton>
              <UButton
                color="neutral"
                variant="ghost"
                :disabled="isCreating"
                @click="showCreateForm = false"
              >
                Отмена
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
