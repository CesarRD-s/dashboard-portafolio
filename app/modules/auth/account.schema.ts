import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js/max";

export const updateEmailSchema = z.object({
    email: z.email("Introduce un correo electrónico válido").trim(),
});

export const updatePhoneSchema = z.object({
    phone: z.string()
        .regex(/^\+[1-9]\d{7,14}$/, "Introduce un número de teléfono válido")
        .refine(isValidPhoneNumber, "El número no coincide con la longitud o formato del país seleccionado"),
});

export const confirmPhoneSchema = z.object({
    phone: z.string().refine(isValidPhoneNumber, "El número de teléfono no es válido"),
    token: z.string().regex(/^\d{6}$/, "Introduce el código de 6 dígitos recibido por SMS"),
});

export const requestPasswordOtpSchema = z.object({});

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Introduce tu contraseña actual").max(256, "La contraseña es demasiado larga"),
    password: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres").max(72, "La nueva contraseña es demasiado larga"),
    passwordConfirmation: z.string(),
    nonce: z.string().regex(/^\d{6}$/, "Introduce el código de 6 dígitos enviado a tu correo"),
}).refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
});

export type UpdateEmailDto = z.infer<typeof updateEmailSchema>;
export type UpdatePhoneDto = z.infer<typeof updatePhoneSchema>;
export type ConfirmPhoneDto = z.infer<typeof confirmPhoneSchema>;
export type RequestPasswordOtpDto = z.infer<typeof requestPasswordOtpSchema>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
