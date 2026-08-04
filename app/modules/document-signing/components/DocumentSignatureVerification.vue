<script setup lang="ts">
import { computed, ref } from 'vue'

import type {
  PdfSignatureVerification,
  VerifyPdfResponse,
} from '#shared/contracts/document-signing/pdf-verification.contracts'

import { DocumentSigningApi } from '../api/document-signing.api'

const toast = useToast()

const selectedFile = ref<File | null>(null)
const verificationResult = ref<VerifyPdfResponse | null>(null)
const isVerifying = ref(false)
const errorMessage = ref<string | null>(null)

const canVerify = computed(() => (
  selectedFile.value !== null
  && !isVerifying.value
))

const resultTitle = computed(() => (
  verificationResult.value?.isValid
    ? 'Подпись действительна'
    : 'Подпись недействительна или обнаружена ошибка'
))

const resultColor = computed(() => (
  verificationResult.value?.isValid
    ? 'success'
    : 'error'
))

function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf'
    || file.name.toLowerCase().endsWith('.pdf')
}

function resetResult(): void {
  verificationResult.value = null
  errorMessage.value = null
}

function onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null

  resetResult()

  if (!file) {
    selectedFile.value = null
    return
  }

  if (!isPdfFile(file)) {
    input.value = ''
    selectedFile.value = null
    toast.add({
      title: 'Неверный формат файла',
      description: 'Для проверки необходимо выбрать PDF-файл.',
      color: 'warning',
    })
    return
  }

  selectedFile.value = file
}

function formatSigningTime(value?: string): string {
  if (!value) {
    return 'Не указана'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function signerName(signature: PdfSignatureVerification): string {
  return signature.signer?.trim() || 'Подписант не указан'
}

async function verifySelectedPdf(): Promise<void> {
  const file = selectedFile.value

  if (!file) {
    return
  }

  isVerifying.value = true
  resetResult()

  try {
    verificationResult.value = await DocumentSigningApi.verifyPdf(file)
  }
  catch (error: unknown) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Не удалось проверить электронную подпись.'

    toast.add({
      title: 'Ошибка проверки подписи',
      description: errorMessage.value,
      color: 'error',
    })
  }
  finally {
    isVerifying.value = false
  }
}
</script>

<template>
  <div class="h-full min-h-0 overflow-y-auto p-5">
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <section>
        <h2 class="text-lg font-semibold text-highlighted">
          Проверка электронной подписи
        </h2>
        <p class="mt-1 text-sm text-muted">
          Выберите подписанный PDF-файл, чтобы проверить целостность документа и сведения о сертификатах.
        </p>
      </section>

      <UCard>
        <div class="space-y-4">
          <UFormField label="PDF-файл">
            <input
              type="file"
              accept="application/pdf,.pdf"
              class="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-elevated file:px-3 file:py-2 file:text-sm file:font-medium file:text-highlighted hover:file:bg-accented"
              @change="onFileSelected"
            >
          </UFormField>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="min-w-0 truncate text-sm text-muted">
              {{ selectedFile?.name || 'Файл не выбран' }}
            </p>

            <UButton
              icon="i-lucide-shield-check"
              :loading="isVerifying"
              :disabled="!canVerify"
              @click="verifySelectedPdf"
            >
              Проверить подпись
            </UButton>
          </div>
        </div>
      </UCard>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        icon="i-lucide-circle-alert"
        title="Проверка не выполнена"
        :description="errorMessage"
      />

      <template v-if="verificationResult">
        <UAlert
          :color="resultColor"
          variant="soft"
          :icon="verificationResult.isValid ? 'i-lucide-badge-check' : 'i-lucide-badge-x'"
          :title="resultTitle"
          :description="verificationResult.errorMessage"
        />

        <section class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <h3 class="font-semibold text-highlighted">
              Найденные подписи
            </h3>
            <UBadge color="neutral" variant="soft">
              {{ verificationResult.signatures.length }}
            </UBadge>
          </div>

          <UAlert
            v-if="verificationResult.signatures.length === 0"
            color="neutral"
            variant="soft"
            icon="i-lucide-file-search"
            title="Подписи не найдены"
            description="Backend не вернул сведений об электронных подписях в выбранном PDF."
          />

          <div
            v-else
            class="space-y-3"
          >
            <UCard
              v-for="(signature, index) in verificationResult.signatures"
              :key="`${signature.thumbprint || 'signature'}-${index}`"
            >
              <div class="space-y-4">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="font-medium text-highlighted">
                      {{ signerName(signature) }}
                    </p>
                    <p class="mt-1 text-sm text-muted">
                      {{ formatSigningTime(signature.signingTime) }}
                    </p>
                  </div>

                  <UBadge
                    :color="signature.integrityValid && signature.certificateTrusted ? 'success' : 'warning'"
                    variant="soft"
                  >
                    Подпись {{ index + 1 }}
                  </UBadge>
                </div>

                <dl class="grid gap-3 text-sm sm:grid-cols-2">
                  <div class="rounded-md bg-elevated p-3">
                    <dt class="text-muted">
                      Целостность документа
                    </dt>
                    <dd class="mt-1 font-medium text-highlighted">
                      {{ signature.integrityValid ? 'Подтверждена' : 'Нарушена' }}
                    </dd>
                  </div>

                  <div class="rounded-md bg-elevated p-3">
                    <dt class="text-muted">
                      Доверие к сертификату
                    </dt>
                    <dd class="mt-1 font-medium text-highlighted">
                      {{ signature.certificateTrusted ? 'Подтверждено' : 'Не подтверждено' }}
                    </dd>
                  </div>
                </dl>

                <div>
                  <p class="text-sm text-muted">
                    Отпечаток сертификата
                  </p>
                  <p class="mt-1 break-all font-mono text-xs text-highlighted">
                    {{ signature.thumbprint || 'Не определён' }}
                  </p>
                </div>
              </div>
            </UCard>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
