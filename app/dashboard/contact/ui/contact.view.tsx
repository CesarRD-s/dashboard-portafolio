import { Section } from '@/app/components/layout/Section';
import { ButtonLink } from '@/app/components/shared/ButtonLink';
import { StatusMessage } from '@/app/components/ui/StatusMessage';
import type { Contact } from '@/app/modules/contacts/contact.model';
import { Plus } from 'lucide-react';
import { ContactCard } from './components/ContactCard';

export function ContactView({ contacts }: { contacts: Contact[] }) {
    return <Section
        id="contact"
        title="Contactos"
        description="Aquí podrás administrar tus medios de contacto que desees mostrar en tu portafolio."
    >
        <div className="flex justify-end">
            <ButtonLink href="/dashboard/contact/new" icon={Plus} label="Nuevo contacto" />
        </div>
        {contacts.length === 0 ? (
            <StatusMessage title="No hay contactos" message="Agrega tus contactos para mostrarlos en tu portafolio." />
        ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contacts.map(contact => <ContactCard key={contact.id} contact={contact} />)}
            </div>
        )}
    </Section>;
}
