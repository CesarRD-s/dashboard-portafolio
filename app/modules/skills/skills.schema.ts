import { z } from 'zod';

const fields = {
    title: z.string().trim().min(1, 'El nombre es obligatorio').max(80, 'El nombre no puede superar 80 caracteres'),
    category: z.string().trim().min(1, 'La categoría es obligatoria').max(60, 'La categoría no puede superar 60 caracteres'),
    isPrimary: z.boolean(),
};

const logoSchema = z.instanceof(File, { message: 'Selecciona un SVG válido' })
    .refine(file => file.size > 0 && file.size <= 1024 * 1024, 'El logo no puede superar 1 MB')
    .refine(file => file.type === 'image/svg+xml' && file.name.toLowerCase().endsWith('.svg'), 'El logo debe ser SVG');

export const skillFormSchema = z.object({ ...fields, logo: logoSchema.optional() });
export const skillCreateServerSchema = z.object({
    ...fields,
    isPrimary: z.enum(['true', 'false']).transform(value => value === 'true'),
    logo: logoSchema,
});
export const skillUpdateServerSchema = skillCreateServerSchema.extend({ logo: logoSchema.optional() });

export type SkillForm = z.infer<typeof skillFormSchema>;
export type SkillCreateInput = z.infer<typeof skillCreateServerSchema>;
export type SkillUpdateInput = z.infer<typeof skillUpdateServerSchema>;
