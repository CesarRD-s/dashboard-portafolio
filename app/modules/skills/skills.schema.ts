import { z } from 'zod';
import { getSkillLogoExtension, MAX_SKILL_LOGO_BYTES } from './skills.logo-config';

const fields = {
    title: z.string().trim().min(1, 'El nombre es obligatorio').max(80, 'El nombre no puede superar 80 caracteres'),
    category: z.string().trim().min(1, 'La categoría es obligatoria').max(60, 'La categoría no puede superar 60 caracteres'),
    isPrimary: z.boolean(),
};

const logoSchema = z.instanceof(File, { message: 'Selecciona una imagen válida' })
    .refine(file => file.size > 0 && file.size <= MAX_SKILL_LOGO_BYTES, 'El logo no puede superar 1 MB')
    .refine(file => getSkillLogoExtension(file) !== null, 'El logo debe ser SVG, PNG, WebP o JPEG');

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
