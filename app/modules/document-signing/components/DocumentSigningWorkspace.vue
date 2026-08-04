<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

import { useAuthStore } from '~/modules/auth'
import { fetchFileBlob } from '~/modules/file-viewer'

import { DocumentSigningApi } from '../api/document-signing.api'
import { usePdfPreview } from '../composables/usePdfPreview'
import { useDocumentSigningSelection } from '../composables/useDocumentSigningSelection'
import {
  DEFAULT_SIGNATURE_STAMP_SIZE,
  clampSignatureStampPosition,
  getSignatureStampDomRect,
  toPdfSignaturePlacement,
  type SignatureStampPosition,
  type SignatureStampSize,
} from '../model/signature-stamp'

const toast = useToast()
const authStore = useAuthStore()
const { selectedDocument } = useDocumentSigningSelection()

const selectedFile = ref<File | null>(null)
const pageWrapper = ref<HTMLElement | null>(null)
const isSigning = ref(false)
const isLoadingRegistryFile = ref(false)
const selectedSource = ref<'local' | 'registry' | null>(null)
let registryFileController: AbortController | null = null

const stampSize = reactive<SignatureStampSize>({
  ...DEFAULT_SIGNATURE_STAMP_SIZE,
})
const stampPosition = reactive<SignatureStampPosition>({
  x: 50,
  y: 50,
})

const preview = usePdfPreview({
  initialScale: 1.25,
})
const pdfCanvas = preview.canvas

const selectedRegistryFile = computed(() => (
  selectedDocument.value?.Files?.find(file => Boolean(file.FileEntryId)) ?? null
))

const selectedRegistryDocumentId = computed(() => selectedDocument.value?.Id)

const sourceDescription = computed(() => {
  if (selectedSource.value === 'registry' && selectedDocument.value) {
    return `Документ из реестра: ${selectedDocument.value.Name}`
  }

  if (selectedSource.value === 'local') {
    return 'Локальный PDF-файл'
  }

  return 'Источник не выбран'
})

const signerName = computed(() => (
  authStore.user?.FullName
  || authStore.user?.Login
  || 'Текущий пользователь'
))

const signingDate = computed(() => (
  new Intl.DateTimeFormat('ru-RU').format(new Date())
))

const stampRect = computed(() => {
  if (!preview.viewport.value) {
    return null
  }

  return getSignatureStampDomRect(
    stampPosition,
    stampSize,
    preview.viewport.value,
  )
})

const stampStyle = computed(() => {
  const rect = stampRect.value

  if (!rect) {
    return undefined
  }

  return {
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  }
})

const pdfPlacement = computed(() => {
  if (!preview.viewport.value || preview.pageNumber.value < 1) {
    return null
  }

  return toPdfSignaturePlacement(
    preview.pageNumber.value,
    stampPosition,
    stampSize,
    preview.viewport.value,
  )
})

const canSign = computed(() => (
  selectedFile.value !== null
  && preview.hasDocument.value
  && pdfPlacement.value !== null
  && !preview.isLoading.value
  && !preview.isRendering.value
  && !isSigning.value
  && !isLoadingRegistryFile.value
))

interface DragState {
  pointerId: number
  offsetX: number
  offsetY: number
}

const dragState = ref<DragState | null>(null)

function clampCurrentStampPosition(): void {
  if (!preview.viewport.value) {
    return
  }

  const position = clampSignatureStampPosition(
    stampPosition,
    stampSize,
    preview.viewport.value,
  )

  stampPosition.x = position.x
  stampPosition.y = position.y
}

watch(
  () => [
    preview.viewport.value?.width,
    preview.viewport.value?.height,
    preview.viewport.value?.scale,
    stampSize.width,
    stampSize.height,
  ],
  clampCurrentStampPosition,
)

async function openPdfFile(file: File, source: 'local' | 'registry'): Promise<void> {
  selectedFile.value = file
  selectedSource.value = source
  stampPosition.x = 50
  stampPosition.y = 50

  await preview.loadFile(file)

  if (preview.errorMessage.value) {
    toast.add({
      title: 'Ошибка открытия PDF',
      description: preview.errorMessage.value,
      color: 'error',
    })
  }
}

async function onFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null

  registryFileController?.abort()

  if (!file) {
    selectedFile.value = null
    selectedSource.value = null
    await preview.releaseDocument()
    return
  }

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    input.value = ''
    selectedFile.value = null
    selectedSource.value = null
    await preview.releaseDocument()
    toast.add({
      title: 'Неверный формат файла',
      description: 'Для подписания необходимо выбрать PDF-файл.',
      color: 'warning',
    })
    return
  }

  await openPdfFile(file, 'local')
}

async function loadSelectedRegistryDocument(): Promise<void> {
  const document = selectedDocument.value
  const fileReference = selectedRegistryFile.value

  registryFileController?.abort()

  if (!document || !fileReference?.FileEntryId) {
    return
  }

  const controller = new AbortController()
  registryFileController = controller
  isLoadingRegistryFile.value = true

  try {
    const blob = await fetchFileBlob(
      fileReference.FileEntryId,
      controller.signal,
    )

    const mimeType = blob.type || 'application/pdf'

    if (blob.type && !['application/pdf', 'application/octet-stream'].includes(blob.type)) {
      throw new Error('Выбранный файл документа не является PDF.')
    }

    const fileName = document.Name.toLowerCase().endsWith('.pdf')
      ? document.Name
      : `${document.Name}.pdf`

    const file = new File([blob], fileName, { type: mimeType })
    await openPdfFile(file, 'registry')
  }
  catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return
    }

    toast.add({
      title: 'Не удалось открыть документ',
      description: error instanceof Error
        ? error.message
        : 'Не удалось загрузить PDF выбранного документа.',
      color: 'error',
    })
  }
  finally {
    if (registryFileController === controller) {
      registryFileController = null
      isLoadingRegistryFile.value = false
    }
  }
}

watch(
  () => [selectedDocument.value?.Id, selectedRegistryFile.value?.FileEntryId],
  loadSelectedRegistryDocument,
)

onBeforeUnmount(() => {
  registryFileController?.abort()
})

function startStampDrag(event: PointerEvent): void {
  const wrapper = pageWrapper.value
  const rect = stampRect.value

  if (!wrapper || !rect) {
    return
  }

  const wrapperRect = wrapper.getBoundingClientRect()

  dragState.value = {
    pointerId: event.pointerId,
    offsetX: event.clientX - wrapperRect.left - rect.x,
    offsetY: event.clientY - wrapperRect.top - rect.y,
  }

  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function moveStamp(event: PointerEvent): void {
  const wrapper = pageWrapper.value
  const drag = dragState.value
  const viewport = preview.viewport.value

  if (!wrapper || !drag || !viewport || drag.pointerId !== event.pointerId) {
    return
  }

  const wrapperRect = wrapper.getBoundingClientRect()
  const nextPosition = clampSignatureStampPosition(
    {
      x: event.clientX - wrapperRect.left - drag.offsetX,
      y: event.clientY - wrapperRect.top - drag.offsetY,
    },
    stampSize,
    viewport,
  )

  stampPosition.x = nextPosition.x
  stampPosition.y = nextPosition.y
}

function stopStampDrag(event: PointerEvent): void {
  if (dragState.value?.pointerId !== event.pointerId) {
    return
  }

  const target = event.currentTarget as HTMLElement

  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId)
  }

  dragState.value = null
}

async function setPreviewScale(nextScale: number): Promise<void> {
  await preview.setScale(nextScale)
}

function buildSignedFileName(fileName: string): string {
  const normalizedName = fileName.toLowerCase().endsWith('.pdf')
    ? fileName.slice(0, -4)
    : fileName

  return `${normalizedName}_signed.pdf`
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

async function signSelectedPdf(): Promise<void> {
  const file = selectedFile.value
  const placement = pdfPlacement.value

  if (!file || !placement) {
    return
  }

  isSigning.value = true

  try {
    const signedPdf = await DocumentSigningApi.signPdf(file, {
      ...placement,
      documentId: selectedSource.value === 'registry'
        ? selectedRegistryDocumentId.value
        : undefined,
      fileEntryId: selectedSource.value === 'registry'
        ? selectedRegistryFile.value?.FileEntryId
        : undefined,
    })
    downloadBlob(signedPdf, buildSignedFileName(file.name))

    toast.add({
      title: 'Документ подписан',
      description: selectedSource.value === 'registry'
        ? 'Подписанный PDF загружен. Сохранение новой версии в реестре будет подключено после фиксации backend-контракта.'
        : 'Подписанный PDF-файл подготовлен к загрузке.',
      color: 'success',
    })
  }
  catch (error: unknown) {
    toast.add({
      title: 'Ошибка подписания',
      description: error instanceof Error
        ? error.message
        : 'Не удалось подписать PDF-файл.',
      color: 'error',
    })
  }
  finally {
    isSigning.value = false
  }
}
</script>

<template>
  <div class="grid h-full min-h-0 grid-cols-[19rem_minmax(0,1fr)] overflow-hidden">
    <aside class="min-h-0 overflow-y-auto border-r border-default p-4">
      <div class="space-y-5">
        <section class="space-y-2">
          <div>
            <h2 class="font-semibold text-highlighted">
              Подписание PDF
            </h2>
            <p class="mt-1 text-sm text-muted">
              Выберите документ в реестре слева или загрузите локальный PDF.
            </p>
            <div class="mt-2 rounded-md bg-elevated px-3 py-2 text-xs text-muted">
              {{ sourceDescription }}
            </div>
          </div>

          <div
            v-if="isLoadingRegistryFile"
            class="flex items-center gap-2 text-xs text-muted"
          >
            <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
            Загрузка файла выбранного документа…
          </div>

          <UFormField label="Локальный PDF-файл">
            <input
              type="file"
              accept="application/pdf,.pdf"
              class="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-elevated file:px-3 file:py-2 file:text-sm file:font-medium file:text-highlighted hover:file:bg-accented"
              @change="onFileSelected"
            >
          </UFormField>
        </section>

        <USeparator />

        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-highlighted">
            Размер штампа, pt
          </h3>

          <div class="grid grid-cols-2 gap-2">
            <UFormField label="Ширина">
              <UInputNumber
                v-model="stampSize.width"
                :min="20"
                :step="10"
                :disabled="!preview.hasDocument.value"
              />
            </UFormField>

            <UFormField label="Высота">
              <UInputNumber
                v-model="stampSize.height"
                :min="20"
                :step="10"
                :disabled="!preview.hasDocument.value"
              />
            </UFormField>
          </div>

          <div class="rounded-md bg-elevated p-3 text-xs text-muted">
            <div>
              Страница: {{ pdfPlacement?.page ?? '—' }}
            </div>
            <div>
              X: {{ pdfPlacement?.x ?? '—' }} pt · Y: {{ pdfPlacement?.y ?? '—' }} pt
            </div>
            <div>
              {{ pdfPlacement?.width ?? '—' }} × {{ pdfPlacement?.height ?? '—' }} pt
            </div>
          </div>
        </section>

        <USeparator />

        <section class="space-y-3">
          <h3 class="text-sm font-semibold text-highlighted">
            Масштаб просмотра
          </h3>

          <div class="grid grid-cols-3 gap-2">
            <UButton
              v-for="scaleOption in [1, 1.25, 1.5]"
              :key="scaleOption"
              size="sm"
              color="neutral"
              :variant="preview.scale.value === scaleOption ? 'solid' : 'outline'"
              :disabled="!preview.hasDocument.value"
              @click="setPreviewScale(scaleOption)"
            >
              {{ Math.round(scaleOption * 100) }}%
            </UButton>
          </div>
        </section>

        <UButton
          block
          icon="i-lucide-pen-line"
          color="primary"
          :disabled="!canSign"
          :loading="isSigning"
          @click="signSelectedPdf"
        >
          Подписать PDF
        </UButton>
      </div>
    </aside>

    <section class="flex min-h-0 min-w-0 flex-col bg-muted/30">
      <header class="flex min-h-14 items-center justify-between gap-3 border-b border-default bg-default px-4">
        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-highlighted">
            {{ preview.fileName.value || 'PDF не выбран' }}
          </p>
          <p v-if="preview.hasDocument.value" class="text-xs text-muted">
            Страница {{ preview.pageNumber.value }} из {{ preview.pageCount.value }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-chevron-left"
            color="neutral"
            variant="outline"
            size="sm"
            :disabled="!preview.canGoToPreviousPage.value || preview.isRendering.value"
            @click="preview.goToPreviousPage"
          />
          <UButton
            icon="i-lucide-chevron-right"
            color="neutral"
            variant="outline"
            size="sm"
            :disabled="!preview.canGoToNextPage.value || preview.isRendering.value"
            @click="preview.goToNextPage"
          />
        </div>
      </header>

      <div class="relative min-h-0 flex-1 overflow-auto p-5">
        <div
          v-if="preview.isLoading.value"
          class="flex h-full min-h-60 items-center justify-center"
        >
          <div class="text-center text-sm text-muted">
            <UIcon name="i-lucide-loader-circle" class="mb-2 size-8 animate-spin" />
            <div>Открытие PDF…</div>
          </div>
        </div>

        <div
          v-else-if="preview.errorMessage.value"
          class="flex h-full min-h-60 items-center justify-center"
        >
          <UAlert
            color="error"
            variant="soft"
            icon="i-lucide-circle-alert"
            title="Не удалось показать PDF"
            :description="preview.errorMessage.value"
          />
        </div>

        <div
          v-else-if="!preview.hasDocument.value"
          class="flex h-full min-h-60 items-center justify-center"
        >
          <div class="max-w-sm text-center text-muted">
            <UIcon name="i-lucide-file-text" class="mb-3 size-12" />
            <p class="font-medium text-highlighted">
              Выберите PDF-файл
            </p>
            <p class="mt-1 text-sm">
              После загрузки здесь появится страница документа и перемещаемый штамп электронной подписи.
            </p>
          </div>
        </div>

        <div v-else class="flex min-w-max justify-center">
          <div
            ref="pageWrapper"
            class="relative inline-block overflow-hidden bg-white shadow-xl"
          >
            <canvas ref="pdfCanvas" class="block" />

            <div
              v-if="stampStyle"
              class="absolute z-10 flex touch-none select-none cursor-move flex-col items-center justify-center overflow-hidden rounded border-2 border-dashed border-primary bg-primary/15 px-2 text-center"
              :style="stampStyle"
              @pointerdown.prevent="startStampDrag"
              @pointermove.prevent="moveStamp"
              @pointerup="stopStampDrag"
              @pointercancel="stopStampDrag"
            >
              <div class="text-[11px] font-bold leading-tight text-primary">
                ДОКУМЕНТ ПОДПИСАН ЭП
              </div>
              <div class="mt-1 max-w-full truncate text-[9px] leading-tight text-gray-800">
                {{ signerName }}
              </div>
              <div class="text-[9px] leading-tight text-gray-700">
                Дата: {{ signingDate }}
              </div>
            </div>

            <div
              v-if="preview.isRendering.value"
              class="absolute inset-0 z-20 flex items-center justify-center bg-white/60"
            >
              <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
