'use server';

import { revalidatePath } from 'next/cache';
import { safeAction } from '@/app/lib/errors/SafeActions';
import { formDataToObject, parseWithSchema } from '@/app/lib/forms/zod';
import { skillCreateServerSchema, skillUpdateServerSchema } from '../skills.schema';
import { SkillsService } from '../skills.service';

export const createSkill = safeAction(async (formData: FormData) => {
    await SkillsService.create(parseWithSchema(skillCreateServerSchema, formDataToObject(formData)));
    revalidatePath('/dashboard', 'layout');
});

export const updateSkill = safeAction(async (id: string, formData: FormData) => {
    await SkillsService.update(id, parseWithSchema(skillUpdateServerSchema, formDataToObject(formData)));
    revalidatePath('/dashboard', 'layout');
});

export const deleteSkill = safeAction(async (id: string) => {
    await SkillsService.delete(id);
    revalidatePath('/dashboard', 'layout');
});
