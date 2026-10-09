'use client'

import { Section } from "@/app/components/layout/Section"
import { ButtonSubmit } from "@/app/components/shared/forms/ButtonSubmit"
import { Field } from "@/app/components/shared/forms/Field"
import { Input } from "@/app/components/shared/forms/Input"
import { InputFile } from "@/app/components/shared/forms/InputFile"
import { Textarea } from "@/app/components/shared/forms/Textarea"
import { useToast } from "@/app/components/toast/toast.provider"
import { toFormData } from "@/app/lib/forms/zod"
import { removeUploadedFileFromBrowser, uploadFileFromBrowser } from "@/app/lib/supabase/storage/browser-upload"
import { AppError } from "@/app/lib/errors/AppError"
import { updateProfileAction } from "@/app/modules/profile/actions/profile.action"
import { Profile } from "@/app/modules/profile/profile.model"
import { profileSchema, ProfileForm } from "@/app/modules/profile/profile.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import Link from "next/link"

type Props = {
    profile: Profile | null
}

export function ProfileEditView({ profile }: Props) {
    const { showToast } = useToast()
    const { register, control, handleSubmit, reset, formState: { errors, isDirty, isValid, isSubmitting } } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            author: profile?.author ?? "",
            year: profile?.year.toString() ?? "",
            shortBio: profile?.shortBio ?? "",
            tagLine: profile?.tagLine ?? "",
            profession: profile?.profession ?? "",
        },
        mode: "onChange",
    });

    const onSubmit = async (values: ProfileForm) => {
        let avatarPath: string | undefined;
        let cvPath: string | undefined;
        const cleanup = async () => Promise.all([
            removeUploadedFileFromBrowser('avatar', avatarPath),
            removeUploadedFileFromBrowser('cv', cvPath),
        ]);

        try {
            if (values.avatar) avatarPath = await uploadFileFromBrowser(values.avatar, 'avatar');
            if (values.cv) cvPath = await uploadFileFromBrowser(values.cv, 'cv');
            const response = await updateProfileAction(toFormData({
                ...values, avatar: undefined, cv: undefined, avatarPath, cvPath,
            }));

            if (!response.success) {
                await cleanup();
                showToast({
                    message: response.error.message,
                    type: response.error.type,
                });
                return;
            }

            if (!profile) {
                window.location.replace('/dashboard/profile');
                return;
            }

            showToast({ message: 'Perfil actualizado correctamente', type: 'success' });

            reset({ ...values, avatar: undefined, cv: undefined })
        } catch (error) {
            await cleanup();
            showToast({ type: 'error', message: error instanceof AppError ? error.message : 'No se pudo actualizar el perfil. Inténtalo de nuevo.' });
        }
    };

    return (
        <Section
            id="profile-edit"
            title={profile ? "Editar perfil" : "Crear perfil"}
            description={profile ? "Actualiza la información pública de tu portafolio" : "Completa la información pública de tu portafolio"}
            className="mx-auto max-w-4xl"
        >

            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="grid gap-6 border-t border-neutral-300 py-8 dark:border-neutral-700 sm:grid-cols-2">
                    <Field label="Autor" htmlFor="profile-author" error={errors.author?.message}>
                        <Input
                            id="profile-author"
                            {...register("author")}
                            error={!!errors.author}
                            placeholder="Ej. Tu nombre o alias"
                        />
                    </Field>

                    <Field label="Año" htmlFor="profile-year" error={errors.year?.message}>
                        <Input
                            id="profile-year"
                            inputMode="numeric"
                            pattern="[0-9]{4}"
                            maxLength={4}
                            {...register("year")}
                            error={!!errors.year}
                            placeholder="Ej. 2026"
                        />
                    </Field>

                </div>

                <div className="space-y-6 border-t border-neutral-300 py-8 dark:border-neutral-700">

                    <Field label="Biografía corta" htmlFor="profile-bio" error={errors.shortBio?.message} hint="Resume tu experiencia en pocas frases.">
                        <Textarea
                            id="profile-bio"
                            rows={4}
                            {...register("shortBio")}
                            error={!!errors.shortBio}
                            placeholder="Ej. Desarrollo productos web centrados en las personas..."
                        />
                    </Field>

                    <Field label="Profesión" htmlFor="profile-profession" error={errors.profession?.message}>
                        <Input
                            id="profile-profession"
                            {...register("profession")}
                            error={!!errors.profession}
                            placeholder="Ej. Desarrollador web"
                        />
                    </Field>

                    <Field label="Frase de presentación" htmlFor="profile-tagline" error={errors.tagLine?.message} hint="Aparece en tu perfil público.">
                        <Input
                            id="profile-tagline"
                            {...register("tagLine")}
                            error={!!errors.tagLine}
                            placeholder="Ej. Construyo experiencias web claras y rápidas"
                        />
                    </Field>

                </div>

                <div className="grid gap-6 border-t border-neutral-300 py-8 dark:border-neutral-700 sm:grid-cols-2">
                    <Field label="Imagen de perfil" error={errors.avatar?.message}>
                        <Controller
                            control={control}
                            name="avatar"
                            render={({ field }) => (
                                <InputFile
                                    helperText="JPG o PNG · Máximo 5 MB"
                                    accept=".jpg,.jpeg,.png"
                                    file={field.value ?? null}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </Field>

                    <Field label="CV" error={errors.cv?.message}>
                        <Controller
                            control={control}
                            name="cv"
                            render={({ field }) => (
                                <InputFile
                                    helperText="PDF · Máximo 5 MB"
                                    accept=".pdf"
                                    file={field.value ?? null}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </Field>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-neutral-300 pt-6 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-end">
                    <Link href="/dashboard/profile" className="inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">Cancelar</Link>
                    <ButtonSubmit
                        isValid={isDirty && isValid}
                        loading={isSubmitting}
                        text={profile ? "Guardar cambios" : "Crear perfil"}
                        icon={<Save size={18} />}
                        className="min-h-10 w-full sm:w-auto"
                    />
                </div>

            </form>
        </Section>
    )
}
