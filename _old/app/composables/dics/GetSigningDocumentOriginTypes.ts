import GetDics from "~/composables/dics/GetDics";
import type {SigningDocumentOriginType} from "#shared/types/dics/signing-document-origin-type";

export default async function () {
    return ref<SigningDocumentOriginType[]>((await GetDics()).data.value?.data?.SigningDocumentOriginTypes ?? []);
}