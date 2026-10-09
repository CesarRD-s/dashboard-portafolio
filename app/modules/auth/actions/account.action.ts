"use server";

import { safeAction } from "@/app/lib/errors/SafeActions";
import { formDataToObject, parseWithSchema } from "@/app/lib/forms/zod";
import { AccountService } from "../account.service";
import { confirmPhoneSchema, updateEmailSchema, updatePasswordSchema, updatePhoneSchema } from "../account.schema";
import { revalidatePath } from "next/cache";

export const requestEmailChangeAction = safeAction(async (formData: FormData) => {
    await AccountService.requestEmailChange(parseWithSchema(updateEmailSchema, formDataToObject(formData)));
});

export const requestPasswordOtpAction = safeAction(async () => {
    await AccountService.requestPasswordOtp();
});

export const requestPhoneChangeAction = safeAction(async (formData: FormData) => {
    await AccountService.requestPhoneChange(parseWithSchema(updatePhoneSchema, formDataToObject(formData)));
});

export const confirmPhoneChangeAction = safeAction(async (formData: FormData) => {
    await AccountService.confirmPhoneChange(parseWithSchema(confirmPhoneSchema, formDataToObject(formData)));
    revalidatePath('/dashboard', 'layout');
});

export const updatePasswordAction = safeAction(async (formData: FormData) => {
    await AccountService.updatePassword(parseWithSchema(updatePasswordSchema, formDataToObject(formData)));
    revalidatePath('/dashboard', 'layout');
});
