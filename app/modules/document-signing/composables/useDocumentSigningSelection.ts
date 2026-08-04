import type { InjectionKey, Ref } from 'vue'
import { inject, provide, ref } from 'vue'

import type { Document } from '#shared/contracts/documents/document.contract'

export interface DocumentSigningSelectionContext {
  selectedDocument: Ref<Document | null>
  selectDocument(document: Document | null): void
}

const documentSigningSelectionKey: InjectionKey<DocumentSigningSelectionContext> = Symbol(
  'document-signing-selection',
)

export function provideDocumentSigningSelection(): DocumentSigningSelectionContext {
  const selectedDocument = ref<Document | null>(null)

  const context: DocumentSigningSelectionContext = {
    selectedDocument,
    selectDocument(document) {
      selectedDocument.value = document
    },
  }

  provide(documentSigningSelectionKey, context)
  return context
}

export function useDocumentSigningSelection(): DocumentSigningSelectionContext {
  const context = inject(documentSigningSelectionKey)

  if (!context) {
    throw new Error('Document signing selection context is not provided')
  }

  return context
}
