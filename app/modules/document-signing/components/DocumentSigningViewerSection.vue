<script setup lang="ts">
import { FileGallery, FileInlineViewer } from '~/modules/file-viewer'

import { getInitialSigningFile } from '../model/signing-selection'

const files = ref([
  {id: "019db3e8-0adb-726a-84de-f6533b67548e", originalName: "test1"},
  {id: "019db451-9804-70ec-9aca-5446b623b075", originalName: "test2"},
  {id: "019dbfcf-202b-7c3a-9970-cb7a2b91c4d6", originalName: "test3"}
])

const selectedFile = ref(getInitialSigningFile(files.value))

</script>

<template>
  <div class="grid grid-cols-2 gap-4 h-[80vh]">
    <FileGallery
        v-model="selectedFile"
        :files="files"
        class="overflow-auto"
    />

    <FileInlineViewer
        v-if="selectedFile"
        :file-id="selectedFile.id"
        :file-name="selectedFile.originalName"
    />
  </div>
</template>

<style scoped>

</style>