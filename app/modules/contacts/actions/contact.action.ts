'use server'

import { safeAction } from "@/app/lib/errors/SafeActions";
import { ContactService } from "../contact.service";
import { revalidatePath } from "next/cache";
import { contactFormDataSchema } from "../contact.schema";
import { formDataToObject, parseWithSchema } from "@/app/lib/forms/zod";

export const createContact = safeAction(async (formData: FormData) => {
    const dto = parseWithSchema(contactFormDataSchema, formDataToObject(formData));
    await ContactService.create(dto);

    revalidatePath("/dashboard", "layout");
});

export const deleteContact = safeAction(async (id: string) => {
    await ContactService.delete(id);
    revalidatePath("/dashboard", "layout");
});

export const updateContact = safeAction(async (id: string, formData: FormData) => {
    const dto = parseWithSchema(contactFormDataSchema, formDataToObject(formData));
    await ContactService.update(id, dto);
    revalidatePath("/dashboard", "layout");
});
