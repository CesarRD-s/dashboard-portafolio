import { z } from "zod";

export const updateEmailSchema = z.object({
    email: z.email("Introduce un correo electrónico válido").trim(),
});

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Introduce tu contraseña actual").max(256, "La contraseña es demasiado larga"),
    password: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres").max(72, "La nueva contraseña es demasiado larga"),
    passwordConfirmation: z.string(),
    nonce: z.union([z.literal(""), z.string().regex(/^\d{6}$/, "Introduce el código de 6 dígitos enviado a tu correo")]),
}).refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirmation"],
});

export type UpdateEmailDto = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
