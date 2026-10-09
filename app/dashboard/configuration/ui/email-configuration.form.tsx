"use client";

import { ButtonSubmit } from "@/app/components/shared/forms/ButtonSubmit";
import { Field } from "@/app/components/shared/forms/Field";
import { Input } from "@/app/components/shared/forms/Input";
import { useToast } from "@/app/components/toast/toast.provider";
import { toFormData } from "@/app/lib/forms/zod";
import { requestEmailChangeAction } from "@/app/modules/auth/actions/account.action";
import { UpdateEmailDto, updateEmailSchema } from "@/app/modules/auth/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

export function EmailConfigurationForm({ email }: { email: string }) {
    const { showToast } = useToast();

    const form = useForm<UpdateEmailDto>({ resolver: zodResolver(updateEmailSchema), defaultValues: { email }, mode: "onChange" });

    const onSubmit = async (values: UpdateEmailDto) => {
        const response = await requestEmailChangeAction(toFormData(values));
        if (!response.success) return showToast({ type: response.error.type, message: response.error.message });
        form.reset(values);
        showToast(
            {
                type: "success",
                duration: 6500,
                message: "Solicitud enviada. Confirma el cambio desde los correos que recibas."
            }
        );
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-md border border-neutral-300 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900/30">
            <div className="mb-6 flex gap-3">
                <Mail className="mt-0.5 text-blue-600" size={20} />
                <div>
                    <h2 className="font-semibold text-neutral-900 dark:text-white">Correo electrónico</h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Correo actual: {email}</p>
                </div>
            </div>
            <div className="max-w-md space-y-4">
                <Field
                    label="Nuevo correo electrónico"
                    htmlFor="email"
                    error={form.formState.errors.email?.message}
                    hint="Confirma el cambio desde los correos que recibas.">
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email" {...form.register("email")}
                        error={!!form.formState.errors.email} />
                </Field>
                <ButtonSubmit
                    isValid={form.formState.isValid && form.formState.isDirty}
                    loading={form.formState.isSubmitting}
                    text="Solicitar cambio de correo"
                    icon={<Mail size={18} />} />
            </div>
        </form>
    );
}
