'use client';

import clsx from 'clsx';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

type Variant = 'default' | 'danger' | 'success' | 'warning';

type Props = {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
    variant?: Variant;
    loading?: boolean;
};

const variantStyles: Record<Variant, string> = {
    default: 'bg-blue-600 hover:bg-blue-500',
    danger: 'bg-red-600 hover:bg-red-500',
    success: 'bg-emerald-600 hover:bg-emerald-500',
    warning: 'bg-amber-500 hover:bg-amber-400',
};

export function ConfirmModal({
    open, title, description, confirmText = 'Confirmar', cancelText = 'Cancelar',
    onConfirm, onClose, variant = 'default', loading = false,
}: Props) {
    const titleId = useId();
    const descriptionId = useId();
    const confirmRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const previouslyFocused = document.activeElement as HTMLElement | null;
        confirmRef.current?.focus();
        return () => previouslyFocused?.focus();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !loading) onClose();
        };
        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [open, loading, onClose]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={loading ? undefined : onClose} />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={description ? descriptionId : undefined}
                className="relative flex w-full max-w-md flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
            >
                <h2 id={titleId} className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h2>
                {description && <p id={descriptionId} className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>}
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} disabled={loading} className="cursor-pointer rounded-md border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800">
                        {cancelText}
                    </button>
                    <button
                        ref={confirmRef}
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={clsx('flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-80', variantStyles[variant])}
                    >
                        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
