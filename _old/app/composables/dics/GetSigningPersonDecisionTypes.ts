import type {SigningPersonDecisionType} from "#shared/types/dics/signing-person-decision-type";
import GetDics from "~/composables/dics/GetDics";

export default async function () {
    return ref<SigningPersonDecisionType[]>((await GetDics()).data.value?.data?.SigningPersonDecisionTypes ?? []);
}