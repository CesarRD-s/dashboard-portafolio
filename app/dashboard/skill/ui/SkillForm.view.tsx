'use client';

import { Section } from '@/app/components/layout/Section';
import { ButtonSubmit } from '@/app/components/shared/forms/ButtonSubmit';
import { Field } from '@/app/components/shared/forms/Field';
import { Input } from '@/app/components/shared/forms/Input';
import { InputFile } from '@/app/components/shared/forms/InputFile';
import { useToast } from '@/app/components/toast/toast.provider';
import { toFormData } from '@/app/lib/forms/zod';
import { createSkill, updateSkill } from '@/app/modules/skills/actions/skills.action';
import type { Skill } from '@/app/modules/skills/skills.model';
import { skillFormSchema, type SkillForm } from '@/app/modules/skills/skills.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

export function SkillFormView({ skill }: { skill?: Skill }) {
    const { showToast } = useToast();
    const schema = skillFormSchema.superRefine((value, context) => {
        if (!skill && !value.logo) context.addIssue({ code: 'custom', path: ['logo'], message: 'Selecciona un logo' });
    });
    const { register, control, handleSubmit, reset, formState: { errors, isDirty, isValid, isSubmitting } } = useForm<SkillForm>({
        resolver: zodResolver(schema),
        defaultValues: { title: skill?.title ?? '', category: skill?.category ?? '', isPrimary: skill?.isPrimary ?? false },
        mode: 'onChange',
    });

    const onSubmit = async (values: SkillForm) => {
        try {
            const formData = toFormData(values);
            const response = skill ? await updateSkill(skill.id, formData) : await createSkill(formData);
            if (!response.success) {
                showToast({ message: response.error.message, type: response.error.type });
                return;
            }
            showToast({ message: skill ? 'Habilidad actualizada correctamente' : 'Habilidad creada correctamente', type: 'success' });
            reset(skill ? { ...values, logo: undefined } : { title: '', category: '', isPrimary: false, logo: undefined });
        } catch (error) {
            console.error('No se pudo guardar la habilidad', error);
            showToast({ type: 'error', message: 'No se pudo guardar la habilidad. Inténtalo de nuevo.' });
        }
    };

    return <Section id="skill-form" title={skill ? 'Editar habilidad' : 'Nueva habilidad'}
        description={skill ? 'Actualiza esta habilidad en tu portafolio.' : 'Agrega una habilidad a tu portafolio.'}
        className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6 border-t border-neutral-300 py-8 dark:border-neutral-700">
                <Field label="Nombre" htmlFor="skill-title" error={errors.title?.message}>
                    <Input id="skill-title" {...register('title')} error={!!errors.title} placeholder="Ej. TypeScript" required className="h-11" />
                </Field>
                <Field label="Categoría" htmlFor="skill-category" error={errors.category?.message}>
                    <Input id="skill-category" {...register('category')} error={!!errors.category} placeholder="Ej. Lenguajes de programación" required className="h-11" />
                </Field>
            </div>

            <div className="space-y-6 border-t border-neutral-300 py-8 dark:border-neutral-700">
                <Field label="Logo" error={errors.logo?.message} hint={skill ? 'El logo actual se conserva si no eliges otro.' : undefined}>
                    <Controller control={control} name="logo" render={({ field }) =>
                        <InputFile id="skill-logo" file={field.value ?? null} helperText="SVG, PNG, WebP o JPEG · Máximo 1 MB" accept=".svg,.png,.webp,.jpg,.jpeg,image/svg+xml,image/png,image/webp,image/jpeg" onChange={file => field.onChange(file ?? undefined)} />
                    } />
                </Field>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-800 dark:text-neutral-200">
                    <input type="checkbox" {...register('isPrimary')} className="mt-0.5 size-4 rounded border-neutral-400 accent-blue-600" />
                    <span>Destacar en el portafolio</span>
                </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-neutral-300 pt-6 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-end">
                <Link href="/dashboard/skill" className="inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">Cancelar</Link>
                <ButtonSubmit isValid={isValid && (!skill || isDirty)} loading={isSubmitting} text={skill ? 'Guardar cambios' : 'Guardar habilidad'} icon={<Save size={18} />} className="min-h-10 w-full sm:w-auto" />
            </div>
        </form>
    </Section>;
}
