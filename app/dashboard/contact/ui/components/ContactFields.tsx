import { Field } from "@/app/components/shared/forms/Field";
import { Input } from "@/app/components/shared/forms/Input";
import { Select } from "@/app/components/shared/forms/Select";
import { categoryContact, typeContact } from "@/app/modules/contacts/contact.model";
import type { ContactForm } from "@/app/modules/contacts/contact.schema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
    register: UseFormRegister<ContactForm>;
    errors: FieldErrors<ContactForm>;
};

export function ContactFields({ register, errors }: Props) {
    return (
        <>
            <div className="space-y-6 border-t border-neutral-300 py-8 dark:border-neutral-700">
                <Field label="Nombre visible" htmlFor="contact-title" error={errors.title?.message}>
                    <Input id="contact-title" {...register("title")} error={!!errors.title} placeholder="Ej. Correo electrónico" className="h-11" />
                </Field>
                <Field label="Dato de contacto" htmlFor="contact-value" error={errors.value?.message} hint="Este dato será visible en tu portafolio.">
                    <Input id="contact-value" {...register("value")} error={!!errors.value} placeholder="Ej. hola@ejemplo.com o @usuario" className="h-11" />
                </Field>
            </div>

            <div className="space-y-6 border-t border-neutral-300 py-8 dark:border-neutral-700">
                <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Categoría" htmlFor="contact-category" error={errors.category?.message}>
                        <Select id="contact-category" {...register("category")} error={!!errors.category} className="h-11">
                            {categoryContact.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
                        </Select>
                    </Field>
                    <Field label="Tipo de contacto" htmlFor="contact-type" error={errors.type?.message}>
                        <Select id="contact-type" {...register("type")} error={!!errors.type} className="h-11">
                            {typeContact.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
                        </Select>
                    </Field>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Enlace" htmlFor="contact-link" error={errors.linkUrl?.message} hint="Opcional">
                        <Input id="contact-link" type="url" {...register("linkUrl")} error={!!errors.linkUrl} placeholder="https://..." className="h-11" />
                    </Field>
                    <Field label="Contacto principal" htmlFor="contact-primary" error={errors.isPrimary?.message}>
                        <Select id="contact-primary" {...register("isPrimary", { setValueAs: value => value === "true" })} className="h-11">
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                        </Select>
                    </Field>
                </div>
            </div>
        </>
    );
}
