'use client';

import { useConfirm } from '@/app/components/shared/modals/confirm.provider';
import { useToast } from '@/app/components/toast/toast.provider';
import { deleteContact } from '@/app/modules/contacts/actions/contact.action';
import { Trash } from 'lucide-react';

export function DeleteContactButton({ id, value }: { id: string; value: string }) {
    const confirm = useConfirm();
    const { showToast } = useToast();

    return <button
        type="button"
        onClick={() => confirm({
            title: 'Eliminar contacto',
            description: `¿Seguro que quieres eliminar "${value}"? Esta acción no se puede deshacer.`,
            confirmText: 'Eliminar',
            variant: 'danger',
            action: async () => {
                const response = await deleteContact(id);
                if (!response.success) {
                    showToast({ message: response.error.message, type: response.error.type });
                    return false;
                }
                showToast({ message: 'Se eliminó correctamente', type: 'success' });
            },
        })}
        className="cursor-pointer text-sm font-medium text-red-500/80 hover:underline"
        aria-label={`Eliminar ${value}`}
    >
        <Trash size={14} className="mr-1 inline-block" />
        Eliminar
    </button>;
}
