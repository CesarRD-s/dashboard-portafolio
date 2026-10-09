import { Section } from "@/app/components/layout/Section";
import { EmailConfigurationForm } from "./email-configuration.form";
import { PasswordConfigurationForm } from "./password-configuration.form";
import { PhoneConfigurationForm } from "./phone-configuration.form";

type Props = { email: string; phone: string | null };

export function ConfigurationView({ email, phone }: Props) {
    return <Section
        id="configuration"
        title="Configuración"
        description="Gestiona las credenciales con las que accedes al dashboard."
        className="mx-auto max-w-4xl"
    >
        <div className="grid gap-6">
            <EmailConfigurationForm email={email} />
            <PhoneConfigurationForm phone={phone} />
            <PasswordConfigurationForm />
        </div>
    </Section>;
}
