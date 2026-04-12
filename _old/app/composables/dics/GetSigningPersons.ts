import type {SigningPerson} from "#shared/types/dics/signing-person";
import GetDics from "~/composables/dics/GetDics";

export default async function () {
    return ref<SigningPerson[]>((await GetDics()).data.value?.data?.SigningPersons ?? []);
}