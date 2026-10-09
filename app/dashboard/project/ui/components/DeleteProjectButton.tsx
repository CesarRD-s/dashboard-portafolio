'use client';

import { useConfirm } from '@/app/components/shared/modals/confirm.provider';
import { useToast } from '@/app/components/toast/toast.provider';
import { deleteProject } from '@/app/modules/projects/actions/projects.action';
import { Trash } from 'lucide-react';

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
    const confirm = useConfirm();
    const { showToast } = useToast();

    return <button
        type="button"
        onClick={() => confirm({
            title: 'Eliminar proyecto',
            description: `¿Seguro que quieres eliminar "${title}"? Esta acción no se puede deshacer.`,
            confirmText: 'Eliminar',
            variant: 'danger',
            action: async () => {
                const response = await deleteProject(id);
                if (!response.success) {
                    showToast({ title: 'Error', message: response.error.message, type: response.error.type });
                    return false;
                }
                showToast({ title: 'Proyecto eliminado', message: 'Se eliminó correctamente', type: 'success' });
            },
        })}
        className="cursor-pointer text-sm font-medium text-red-500/80 hover:underline"
        aria-label={`Eliminar ${title}`}
    >
        <Trash size={14} className="mr-1 inline-block" />
        Eliminar
    </button>;
}
