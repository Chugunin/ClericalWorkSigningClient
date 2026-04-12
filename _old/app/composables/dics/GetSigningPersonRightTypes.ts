import type {SigningPersonRightType} from "#shared/types/dics/signing-person-right-type";
import GetDics from "~/composables/dics/GetDics";

export default async function () {
    return ref<SigningPersonRightType[]>((await GetDics()).data.value?.data?.SigningPersonRightTypes ?? []);
}