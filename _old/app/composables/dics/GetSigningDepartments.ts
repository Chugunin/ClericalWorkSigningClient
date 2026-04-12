import type {SigningDepartment} from "#shared/types/dics/signing-department";
import GetDics from "~/composables/dics/GetDics";

export default async function () {
    return ref<SigningDepartment[]>((await GetDics()).data.value?.data?.SigningDepartments ?? []);
}