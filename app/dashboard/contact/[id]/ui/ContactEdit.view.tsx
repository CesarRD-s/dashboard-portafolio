'use client';

import { Section } from "@/app/components/layout/Section";
import { ButtonSubmit } from "@/app/components/shared/forms/ButtonSubmit";
import { useToast } from "@/app/components/toast/toast.provider";
import { toFormData } from "@/app/lib/forms/zod";
import { updateContact } from "@/app/modules/contacts/actions/contact.action";
import { contactSchema, ContactForm } from "@/app/modules/contacts/contact.schema";
import { Contact } from "@/app/modules/contacts/contact.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ContactFields } from "@/app/dashboard/contact/ui/components/ContactFields";

type Props = {
    contact: Contact
};

export function ContactEditView({ contact }: Props) {
    const { showToast } = useToast();
    const { register, handleSubmit, reset, formState: { errors, isDirty, isValid, isSubmitting } } = useForm<ContactForm>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            title: contact.title,
            value: contact.value,
            category: contact.category as ContactForm["category"],
            type: contact.type as ContactForm["type"],
            linkUrl: contact.linkUrl ?? "",
            isPrimary: contact.isPrimary,
        },
        mode: "onChange",
    });

    const onSubmit = async (values: ContactForm) => {
            const response = await updateContact(contact.id, toFormData(values));

            if (!response.success) {
                showToast({
                    message: response.error.message,
                    type: response.error.type,
                });
                return;
            }

            showToast({
                message: "Contacto actualizado correctamente",
                type: "success",
            });
            reset(values);
    };

    return (
        <Section
            id="contact-edit"
            title="Editar Contacto"
            description="Actualiza información de tu contacto"
            className="mx-auto max-w-4xl"
        >

            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <ContactFields register={register} errors={errors} />

                <div className="flex flex-col-reverse gap-3 border-t border-neutral-300 pt-6 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-end">
                    <Link href="/dashboard/contact" className="inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white">Cancelar</Link>
                    <ButtonSubmit isValid={isDirty && isValid} loading={isSubmitting} text="Guardar cambios" icon={<Save size={16} />} className="min-h-10 w-full sm:w-auto" />
                </div>

            </form>
        </Section>
    );
}
