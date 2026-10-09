'use client';

import { useEffect } from 'react';

export default function ErrorPage({ error, unstable_retry }: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
    useEffect(() => { console.error('Error al cargar la página', error); }, [error]);

    return <main className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-md border border-neutral-300 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <h1 className="text-xl font-semibold">No se pudo cargar la página</h1>
            <p className="mt-2 text-sm text-neutral-500">Comprueba tu conexión e inténtalo de nuevo.</p>
            <button type="button" onClick={unstable_retry} className="mt-5 cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
                Reintentar
            </button>
        </div>
    </main>;
}
