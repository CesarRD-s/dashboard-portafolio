"use client";

import { ButtonSubmit } from "@/app/components/shared/forms/ButtonSubmit";
import { Field } from "@/app/components/shared/forms/Field";
import { Input } from "@/app/components/shared/forms/Input";
import { ShowPassword } from "@/app/components/shared/forms/ShowPassword";
import { useToast } from "@/app/components/toast/toast.provider";
import { toFormData } from "@/app/lib/forms/zod";
import { requestPasswordOtpAction, updatePasswordAction } from "@/app/modules/auth/actions/account.action";
import { UpdatePasswordDto, updatePasswordSchema } from "@/app/modules/auth/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const REAUTH_MESSAGE = "Por seguridad, Supabase requiere un código de verificación. Solicítalo para continuar.";

export function PasswordConfigurationForm() {
    const { showToast } = useToast();
    const [needsCode, setNeedsCode] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const form = useForm<UpdatePasswordDto>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: { currentPassword: "", password: "", passwordConfirmation: "", nonce: "" },
        mode: "onChange",
    });
    const nonce = useWatch({ control: form.control, name: "nonce" });

    const requestCode = async () => {
        setRequesting(true);
        try {
            const response = await requestPasswordOtpAction();
            showToast(response.success
                ? { type: "info", message: "Te enviamos un código de 6 dígitos a tu correo." }
                : { type: response.error.type, message: response.error.message });
        } finally {
            setRequesting(false);
        }
    };

    const onSubmit = async (values: UpdatePasswordDto) => {
        const response = await updatePasswordAction(toFormData(values));
        if (!response.success) {
            if (response.error.message === REAUTH_MESSAGE) setNeedsCode(true);
            return showToast({ type: response.error.type, message: response.error.message });
        }
        form.reset();
        setNeedsCode(false);
        showToast({ type: "success", message: "Tu contraseña fue actualizada correctamente." });
    };

    return <section className="rounded-md border border-neutral-300 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900/30">
        <div className="mb-6 flex gap-3">
            <KeyRound className="mt-0.5 text-blue-600" size={20} />
            <div>
                <h2 className="font-semibold text-neutral-900 dark:text-white">Contraseña</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Cámbiala con tu contraseña actual.</p>
            </div>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-5">
            <Field label="Contraseña actual" htmlFor="currentPassword" error={form.formState.errors.currentPassword?.message}>
                <Input id="currentPassword" type={showPasswords ? "text" : "password"} autoComplete="current-password" {...form.register("currentPassword")} error={!!form.formState.errors.currentPassword} />
            </Field>
            <Field label="Nueva contraseña" htmlFor="password" error={form.formState.errors.password?.message} hint="Usa al menos 8 caracteres.">
                <Input id="password" type={showPasswords ? "text" : "password"} autoComplete="new-password" {...form.register("password")} error={!!form.formState.errors.password} />
            </Field>
            <Field label="Confirmar nueva contraseña" htmlFor="passwordConfirmation" error={form.formState.errors.passwordConfirmation?.message}>
                <Input id="passwordConfirmation" type={showPasswords ? "text" : "password"} autoComplete="new-password" {...form.register("passwordConfirmation")} error={!!form.formState.errors.passwordConfirmation} />
            </Field>
            {needsCode && <div className="space-y-3">
                <Field label="Código de verificación" htmlFor="nonce" error={form.formState.errors.nonce?.message}>
                    <Input id="nonce" inputMode="numeric" autoComplete="one-time-code" maxLength={6} {...form.register("nonce")} error={!!form.formState.errors.nonce} />
                </Field>
                <button type="button" onClick={requestCode} disabled={requesting} className="cursor-pointer text-sm font-medium text-blue-600 hover:underline disabled:opacity-50">
                    {requesting ? "Enviando código..." : "Enviar código a mi correo"}
                </button>
            </div>}
            <ShowPassword showPassword={showPasswords} handleToggle={setShowPasswords} />
            <ButtonSubmit isValid={form.formState.isValid && (!needsCode || /^\d{6}$/.test(nonce))} loading={form.formState.isSubmitting} text="Actualizar contraseña" icon={<KeyRound size={18} />} />
        </form>
    </section>;
}
