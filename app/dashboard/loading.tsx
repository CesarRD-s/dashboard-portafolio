export default function Loading() {
    return <div className="space-y-4" role="status" aria-label="Cargando dashboard">
        <div className="h-7 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map(index => <div key={index} className="h-40 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />)}
        </div>
    </div>;
}
