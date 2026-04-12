import type {SigningDocumentFileType} from "#shared/types/dics/signing-document-file-type";
import GetDics from "~/composables/dics/GetDics";

export default async function () {
    return ref<SigningDocumentFileType[]>((await GetDics()).data.value?.data?.SigningDocumentFileTypes ?? []);
}