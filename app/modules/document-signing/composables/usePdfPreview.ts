import type {
  PDFDocumentProxy,
  RenderTask,
} from 'pdfjs-dist'
import {
  computed,
  onScopeDispose,
  readonly,
  ref,
  shallowRef,
} from 'vue'

export interface PdfPreviewViewport {
  width: number
  height: number
  scale: number
}

export interface UsePdfPreviewOptions {
  initialScale?: number
}

const DEFAULT_SCALE = 1.25

function normalizePageNumber(
  pageNumber: number,
  pageCount: number,
): number {
  if (pageCount <= 0) {
    return 0
  }

  return Math.min(
    Math.max(Math.trunc(pageNumber), 1),
    pageCount,
  )
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Не удалось открыть PDF-файл'
}

function isRenderingCancelled(error: unknown): boolean {
  return (
    typeof error === 'object'
    && error !== null
    && 'name' in error
    && error.name === 'RenderingCancelledException'
  )
}

export function usePdfPreview(
  options: UsePdfPreviewOptions = {},
) {
  const canvas = shallowRef<HTMLCanvasElement | null>(null)
  const document = shallowRef<PDFDocumentProxy | null>(null)
  const renderTask = shallowRef<RenderTask | null>(null)

  const fileName = ref('')
  const pageNumber = ref(0)
  const pageCount = ref(0)
  const viewport = ref<PdfPreviewViewport | null>(null)
  const isLoading = ref(false)
  const isRendering = ref(false)
  const errorMessage = ref<string | null>(null)

  const scale = ref(
    options.initialScale && options.initialScale > 0
      ? options.initialScale
      : DEFAULT_SCALE,
  )

  let loadOperationId = 0
  let renderOperationId = 0

  const hasDocument = computed(() => document.value !== null)
  const canGoToPreviousPage = computed(() => pageNumber.value > 1)
  const canGoToNextPage = computed(() => (
    pageNumber.value > 0
    && pageNumber.value < pageCount.value
  ))

  async function loadPdfJs() {
    if (import.meta.server) {
      throw new Error('PDF preview is available only in the browser')
    }

    const pdfjs = await import('pdfjs-dist')

    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url,
      ).toString()
    }

    return pdfjs
  }

  function cancelRender(): void {
    renderTask.value?.cancel()
    renderTask.value = null
    isRendering.value = false
  }

  async function releaseDocument(): Promise<void> {
    loadOperationId += 1
    renderOperationId += 1
    cancelRender()

    const currentDocument = document.value
    document.value = null

    if (currentDocument) {
      await currentDocument.destroy()
    }

    fileName.value = ''
    pageNumber.value = 0
    pageCount.value = 0
    viewport.value = null
    errorMessage.value = null
  }

  async function renderPage(requestedPage: number): Promise<void> {
    const currentDocument = document.value
    const currentCanvas = canvas.value

    if (!currentDocument || !currentCanvas) {
      return
    }

    const targetPage = normalizePageNumber(
      requestedPage,
      currentDocument.numPages,
    )

    if (targetPage === 0) {
      return
    }

    const currentOperation = ++renderOperationId
    cancelRender()
    isRendering.value = true
    errorMessage.value = null

    try {
      const page = await currentDocument.getPage(targetPage)

      if (currentOperation !== renderOperationId) {
        return
      }

      const pageViewport = page.getViewport({
        scale: scale.value,
      })
      const context = currentCanvas.getContext('2d')

      if (!context) {
        throw new Error('Не удалось получить контекст PDF canvas')
      }

      currentCanvas.width = Math.ceil(pageViewport.width)
      currentCanvas.height = Math.ceil(pageViewport.height)

      const task = page.render({
        canvas: currentCanvas,
        canvasContext: context,
        viewport: pageViewport,
      })

      renderTask.value = task
      await task.promise

      if (currentOperation !== renderOperationId) {
        return
      }

      pageNumber.value = targetPage
      viewport.value = {
        width: pageViewport.width,
        height: pageViewport.height,
        scale: pageViewport.scale,
      }
    }
    catch (error: unknown) {
      if (!isRenderingCancelled(error)) {
        errorMessage.value = getErrorMessage(error)
      }
    }
    finally {
      if (currentOperation === renderOperationId) {
        renderTask.value = null
        isRendering.value = false
      }
    }
  }

  async function loadFile(file: File): Promise<void> {
    const currentOperation = ++loadOperationId
    renderOperationId += 1
    cancelRender()
    isLoading.value = true
    errorMessage.value = null

    const previousDocument = document.value
    document.value = null

    try {
      if (previousDocument) {
        await previousDocument.destroy()
      }

      const pdfjs = await loadPdfJs()
      const source = await file.arrayBuffer()
      const loadingTask = pdfjs.getDocument({ data: source })
      const loadedDocument = await loadingTask.promise

      if (currentOperation !== loadOperationId) {
        await loadedDocument.destroy()
        return
      }

      document.value = loadedDocument
      fileName.value = file.name
      pageCount.value = loadedDocument.numPages
      pageNumber.value = normalizePageNumber(1, loadedDocument.numPages)

      await renderPage(pageNumber.value)
    }
    catch (error: unknown) {
      if (currentOperation === loadOperationId) {
        fileName.value = ''
        pageNumber.value = 0
        pageCount.value = 0
        viewport.value = null
        errorMessage.value = getErrorMessage(error)
      }
    }
    finally {
      if (currentOperation === loadOperationId) {
        isLoading.value = false
      }
    }
  }

  async function goToPreviousPage(): Promise<void> {
    if (canGoToPreviousPage.value) {
      await renderPage(pageNumber.value - 1)
    }
  }

  async function goToNextPage(): Promise<void> {
    if (canGoToNextPage.value) {
      await renderPage(pageNumber.value + 1)
    }
  }

  async function setScale(nextScale: number): Promise<void> {
    if (!Number.isFinite(nextScale) || nextScale <= 0) {
      return
    }

    scale.value = nextScale

    if (document.value && pageNumber.value > 0) {
      await renderPage(pageNumber.value)
    }
  }

  onScopeDispose(() => {
    void releaseDocument()
  })

  return {
    canvas,
    fileName: readonly(fileName),
    pageNumber: readonly(pageNumber),
    pageCount: readonly(pageCount),
    viewport: readonly(viewport),
    scale: readonly(scale),
    isLoading: readonly(isLoading),
    isRendering: readonly(isRendering),
    errorMessage: readonly(errorMessage),
    hasDocument,
    canGoToPreviousPage,
    canGoToNextPage,
    loadFile,
    renderPage,
    goToPreviousPage,
    goToNextPage,
    setScale,
    releaseDocument,
  }
}
