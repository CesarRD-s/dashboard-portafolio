"use client";

import { ButtonSubmit } from "@/app/components/shared/forms/ButtonSubmit";
import { Field } from "@/app/components/shared/forms/Field";
import { Input } from "@/app/components/shared/forms/Input";
import { useToast } from "@/app/components/toast/toast.provider";
import { toFormData } from "@/app/lib/forms/zod";
import {
    confirmPhoneChangeAction,
    requestPhoneChangeAction,
} from "@/app/modules/auth/actions/account.action";
import {
    ConfirmPhoneDto,
    UpdatePhoneDto,
    confirmPhoneSchema,
    updatePhoneSchema,
} from "@/app/modules/auth/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Send } from "lucide-react";
import { useState } from "react";
import labels from "react-phone-number-input/locale/es.json";
import PhoneInput from "react-phone-number-input";
import { Controller, useForm } from "react-hook-form";

export function PhoneConfigurationForm({ phone }: { phone: string | null }) {
    const { showToast } = useToast();

    const [pendingPhone, setPendingPhone] = useState<string | null>(null);

    const phoneForm = useForm<UpdatePhoneDto>({
        resolver: zodResolver(updatePhoneSchema),
        defaultValues: {
            phone: phone ?? "",
        },
        mode: "onChange",
    });

    const codeForm = useForm<ConfirmPhoneDto>({
        resolver: zodResolver(confirmPhoneSchema),
        defaultValues: {
            phone: "",
            token: "",
        },
        mode: "onChange",
    });

    const requestCode = async (values: UpdatePhoneDto) => {
        const response = await requestPhoneChangeAction(
            toFormData(values)
        );

        if (!response.success) {
            return showToast({
                type: response.error.type,
                message: response.error.message,
            });
        }

        setPendingPhone(values.phone);

        codeForm.reset({
            phone: values.phone,
            token: "",
        });

        showToast({
            type: "info",
            message: "Te enviamos un código de 6 dígitos por SMS.",
        });
    };

    const confirmPhone = async (values: ConfirmPhoneDto) => {
        const response = await confirmPhoneChangeAction(
            toFormData(values)
        );

        if (!response.success) {
            return showToast({
                type: response.error.type,
                message: response.error.message,
            });
        }

        phoneForm.reset({
            phone: values.phone,
        });

        setPendingPhone(null);

        showToast({
            type: "success",
            message: "Tu número de teléfono fue confirmado.",
        });
    };

    return (
        <section className="rounded-md border border-neutral-300 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900/30">
            <div className="mb-6 flex gap-3">
                <Phone
                    className="mt-0.5 text-blue-600"
                    size={20}
                />

                <div>
                    <h2 className="font-semibold text-neutral-900 dark:text-white">
                        Teléfono
                    </h2>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {phone
                            ? `Número actual: ${phone}`
                            : "Añade un número para reforzar la recuperación de tu cuenta."}
                    </p>
                </div>
            </div>

            {!pendingPhone ? (
                <form
                    onSubmit={phoneForm.handleSubmit(requestCode)}
                    className="max-w-md space-y-4"
                >
                    <Field
                        label="Número nuevo"
                        htmlFor="phone"
                        error={phoneForm.formState.errors.phone?.message}
                        hint="Selecciona tu país para añadir el prefijo automáticamente."
                    >
                        <Controller
                            control={phoneForm.control}
                            name="phone"
                            render={({ field }) => (
                                <PhoneInput
                                    id="phone"
                                    labels={labels}
                                    defaultCountry="HN"
                                    international
                                    countryCallingCodeEditable={false}
                                    limitMaxLength
                                    value={field.value}
                                    onChange={(value) =>
                                        field.onChange(value ?? "")
                                    }
                                    className={`rounded-md border bg-white px-3 py-2 dark:bg-neutral-800 ${phoneForm.formState.errors.phone
                                        ? "border-red-500 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/75"
                                        : "border-neutral-300 dark:border-neutral-700 focus-within:ring-2 focus-within:ring-blue-600/75"
                                        }`}
                                    numberInputProps={{
                                        autoComplete: "tel",
                                        className:
                                            "min-w-0 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-neutral-500",
                                    }}
                                />
                            )}
                        />
                    </Field>

                    <ButtonSubmit
                        isValid={
                            phoneForm.formState.isValid &&
                            phoneForm.formState.isDirty
                        }
                        loading={phoneForm.formState.isSubmitting}
                        text="Enviar código por SMS"
                        icon={<Send size={18} />}
                    />
                </form>
            ) : (
                <form
                    onSubmit={codeForm.handleSubmit(confirmPhone)}
                    className="max-w-md space-y-4"
                >
                    <p className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
                        Introduce el código enviado a {pendingPhone}.
                    </p>

                    <Field
                        label="Código de verificación"
                        htmlFor="phone-token"
                        error={codeForm.formState.errors.token?.message}
                    >
                        <Input
                            id="phone-token"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            {...codeForm.register("token")}
                            error={!!codeForm.formState.errors.token}
                        />
                    </Field>

                    <div className="flex gap-3">
                        <ButtonSubmit
                            isValid={codeForm.formState.isValid}
                            loading={codeForm.formState.isSubmitting}
                            text="Confirmar número"
                            icon={<Phone size={18} />}
                        />

                        <button
                            type="button"
                            onClick={() => setPendingPhone(null)}
                            className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                        >
                            Cambiar número
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
