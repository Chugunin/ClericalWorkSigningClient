import type {SigningPersonRoleType} from "#shared/types/dics/signing-person-role-type";
import GetDics from "~/composables/dics/GetDics";

export default async function () {
    return ref<SigningPersonRoleType[]>((await GetDics()).data.value?.data?.SigningPersonRoleTypes ?? []);
}