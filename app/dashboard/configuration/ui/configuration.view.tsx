import { Section } from "@/app/components/layout/Section";
import { EmailConfigurationForm } from "./email-configuration.form";
import { PasswordConfigurationForm } from "./password-configuration.form";

type Props = { email: string };

export function ConfigurationView({ email }: Props) {
    return <Section
        id="configuration"
        title="Configuración"
        description="Gestiona el acceso a tu dashboard."
        className="mx-auto max-w-4xl"
    >
        <div className="grid gap-6">
            <EmailConfigurationForm email={email} />
            <PasswordConfigurationForm />
        </div>
    </Section>;
}
