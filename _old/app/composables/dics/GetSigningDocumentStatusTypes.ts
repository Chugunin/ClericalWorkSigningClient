import type {SigningDocumentStatusType} from "#shared/types/dics/signing-document-status-type";
import GetDics from "~/composables/dics/GetDics";

export default async function () {
    return ref<SigningDocumentStatusType[]>((await GetDics()).data.value?.data?.SigningDocumentStatusTypes ?? []);
}