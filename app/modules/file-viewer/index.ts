export { default as FileGallery } from './components/FileGallery.vue'
export { default as FileInlineViewer } from './components/FileInlineViewer.vue'
export { default as FileViewer } from './components/FileViewer.vue'

export { saveFileEntry, useFileEntries } from './composables/useFileEntries'
export {
  canPreviewFileKind,
  getExtension,
  getFileInfo,
  getFileKindByMimeAndExtension,
} from './lib/file-info'

export type { FileInfoSource, FileKind } from './lib/file-info'
export type { FileViewerItem } from './types/file-item'
