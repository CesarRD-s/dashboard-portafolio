import { z } from "zod";

const projectImageSchema = z
    .instanceof(File, { message: "Selecciona una imagen válida" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "La imagen no puede superar 5 MB")
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), "La imagen debe ser JPG o PNG");

const projectFields = {
    title: z.string().trim().min(1, "El título es obligatorio").max(120, "El título no puede superar 120 caracteres"),
    description: z.string().trim().min(1, "La descripción es obligatoria").max(2000, "La descripción no puede superar 2000 caracteres"),
    stack: z.string().trim().min(1, "Indica al menos una tecnología").max(500, "La lista de tecnologías es demasiado larga"),
    role: z.enum(["Desarrollador Frontend", "Desarrollador Backend", "Desarrollador Fullstack"], {
        message: "Selecciona un rol válido",
    }),
    link: z.union([z.literal(""), z.url("Introduce una URL válida")]),
};

export const projectCreateSchema = z.object({
    ...projectFields,
    img: projectImageSchema,
});

export const projectUpdateSchema = z.object({
    ...projectFields,
    img: projectImageSchema.optional(),
});

export const projectCreateServerSchema = z.object({
    ...projectFields,
    imgPath: z.string().min(1, 'La imagen es obligatoria'),
});

export const projectUpdateServerSchema = z.object({
    ...projectFields,
    imgPath: z.string().optional(),
});

export type ProjectCreateForm = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateForm = z.infer<typeof projectUpdateSchema>;
export type ProjectCreateInput = z.infer<typeof projectCreateServerSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateServerSchema>;
