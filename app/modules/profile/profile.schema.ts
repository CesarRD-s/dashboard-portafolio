import { z } from "zod";

const imageSchema = z
    .instanceof(File, { message: "Selecciona una imagen válida" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "La imagen no puede superar 5 MB")
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), "El avatar debe ser JPG o PNG");

const cvSchema = z
    .instanceof(File, { message: "Selecciona un CV válido" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "El CV no puede superar 5 MB")
    .refine((file) => file.type === "application/pdf", "El CV debe ser un PDF");

const profileFields = {
    author: z.string().trim().min(1, "El autor es obligatorio").max(100, "El autor no puede superar 100 caracteres"),
    shortBio: z.string().trim().min(1, "La biografía es obligatoria").max(500, "La biografía no puede superar 500 caracteres"),
    profession: z.string().trim().min(1, "La profesión es obligatoria").max(120, "La profesión no puede superar 120 caracteres"),
    tagLine: z.string().trim().min(1, "La línea de etiqueta es obligatoria").max(200, "La línea de etiqueta no puede superar 200 caracteres"),
    year: z.string().regex(/^\d{4}$/, "Introduce un año de cuatro dígitos"),
};

export const profileSchema = z.object({
    ...profileFields,
    avatar: imageSchema.optional(),
    cv: cvSchema.optional(),
});

export const profileUpdateServerSchema = z.object({
    ...profileFields,
    avatarPath: z.string().optional(),
    cvPath: z.string().optional(),
});

export type ProfileForm = z.infer<typeof profileSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateServerSchema>;
