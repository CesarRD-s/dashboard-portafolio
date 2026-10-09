'use client'

import { Section } from "@/app/components/layout/Section"
import { ButtonSubmit } from "@/app/components/shared/forms/ButtonSubmit"
import { Field } from "@/app/components/shared/forms/Field"
import { Input } from "@/app/components/shared/forms/Input"
import { InputFile } from "@/app/components/shared/forms/InputFile"
import { Select } from "@/app/components/shared/forms/Select"
import { Textarea } from "@/app/components/shared/forms/Textarea"
import { useToast } from "@/app/components/toast/toast.provider"
import { toFormData } from "@/app/lib/forms/zod"
import { removeUploadedFileFromBrowser, uploadFileFromBrowser } from "@/app/lib/supabase/storage/browser-upload"
import { AppError } from "@/app/lib/errors/AppError"
import { updateProject } from "@/app/modules/projects/actions/projects.action"
import { Project, roleOptions } from "@/app/modules/projects/projects.model"
import { projectUpdateSchema, ProjectUpdateForm } from "@/app/modules/projects/projects.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"

type Props = {
    project: Project
}

export function ProjectEditView({ project }: Props) {
    const { showToast } = useToast()
    const { register, control, handleSubmit, reset, formState: { errors, isDirty, isValid, isSubmitting } } = useForm<ProjectUpdateForm>({
        resolver: zodResolver(projectUpdateSchema),
        defaultValues: {
            title: project.title,
            description: project.description,
            role: project.role as ProjectUpdateForm["role"],
            stack: project.stack.join(", "),
            link: project.link ?? "",
        },
        mode: "onChange",
    });

    const onSubmit = async (values: ProjectUpdateForm) => {
        let imgPath: string | undefined;
        try {
            if (values.img) imgPath = await uploadFileFromBrowser(values.img, 'projectImage');
            const response = await updateProject(project.id, toFormData({ ...values, img: undefined, imgPath }));

            if (!response.success) {
                await removeUploadedFileFromBrowser('projectImage', imgPath);
                showToast({
                    title: "Error",
                    message: response.error.message,
                    type: response.error.type,
                });
                return;
            }

            showToast({
                title: "Éxito",
                message: "Proyecto actualizado correctamente",
                type: "success",
            });
            reset({ ...values, img: undefined });
        } catch (error) {
            await removeUploadedFileFromBrowser('projectImage', imgPath);
            showToast({ type: 'error', message: error instanceof AppError ? error.message : 'No se pudo actualizar el proyecto. Inténtalo de nuevo.' });
        }
    }

    return (
        <Section
            id="project-edit"
            title="Editar Proyecto"
            description="Actualiza información de tu proyecto"
            className="mx-auto max-w-4xl"
        >

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6 border-t border-neutral-300 py-8 dark:border-neutral-700">
                    <Field label="Título" htmlFor="project-title" error={errors.title?.message} hint="Usa un nombre breve y fácil de reconocer.">
                        <Input id="project-title" {...register("title")} error={!!errors.title} placeholder="Ej. Plataforma de reservas" className="h-11" />
                    </Field>
                    <Field label="Descripción" htmlFor="project-description" error={errors.description?.message} hint="Cuenta qué resolviste y cuál fue el resultado.">
                        <Textarea id="project-description" rows={5} {...register("description")} error={!!errors.description} placeholder="Ej. Una plataforma para reservar espacios de trabajo..." className="min-h-36 resize-y" />
                    </Field>
                </div>

                <div className="space-y-6 border-t border-neutral-300 py-8 dark:border-neutral-700">
                    <Field label="Tecnologías usadas" htmlFor="project-stack" error={errors.stack?.message} hint="Sepáralas con comas.">
                        <Input id="project-stack" {...register("stack")} error={!!errors.stack} placeholder="Ej. Next.js, TypeScript, Supabase" className="h-11" />
                    </Field>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Rol" htmlFor="project-role" error={errors.role?.message}>
                            <Select id="project-role" {...register("role")} error={!!errors.role} className="h-11">
                                {roleOptions.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
                            </Select>
                        </Field>
                        <Field label="Enlace" htmlFor="project-link" error={errors.link?.message} hint="Opcional">
                            <Input id="project-link" type="url" {...register("link")} error={!!errors.link} placeholder="https://..." className="h-11" />
                        </Field>
                    </div>
                </div>

                <div className="border-t border-neutral-300 py-8 dark:border-neutral-700">
                    <Field label="Imagen del proyecto" error={errors.img?.message}>
                        <Controller control={control} name="img" render={({ field }) => (
                            <InputFile file={field.value ?? null} helperText="JPG o PNG · Máximo 5 MB" accept=".jpg,.jpeg,.png" onChange={field.onChange} />
                        )} />
                    </Field>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-neutral-300 pt-6 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-end">
                    <Link href="/dashboard/project" className="inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">Cancelar</Link>
                    <ButtonSubmit isValid={isDirty && isValid} loading={isSubmitting} text="Guardar cambios" icon={<Save size={16} />} className="min-h-10 w-full sm:w-auto" />
                </div>
            </form>
        </Section>
    )
}
