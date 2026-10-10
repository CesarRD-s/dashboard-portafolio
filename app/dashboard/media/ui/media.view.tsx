"use client";

import { Section } from "@/app/components/layout/Section";
import { useConfirm } from "@/app/components/shared/modals/confirm.provider";
import { useToast } from "@/app/components/toast/toast.provider";
import { AppError } from "@/app/lib/errors/AppError";
import { getSupabaseBrowser } from "@/app/lib/supabase/browser";
import { uploadAssetImageFromBrowser } from "@/app/lib/supabase/storage/browser-upload";
import { deleteMediaImageAction } from "@/app/modules/media/actions/media.action";
import clsx from "clsx";
import { CheckCircle, ChevronRight, Copy, ExternalLink, FileText, Folder, Images, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 48;
const IMAGE_EXTENSION = /\.(svg|png|jpe?g|webp|gif|avif)$/i;
type Source = "projects" | "assets" | "users";
type StorageEntry = { name: string; metadata: unknown };
type MediaItem =
    | { kind: "folder"; name: string; path: string; relativePath: string }
    | { kind: "file"; name: string; path: string; url: string; pdf: boolean };

export function MediaView({ userId }: { userId: string }) {
    const { showToast } = useToast();
    const confirm = useConfirm();
    const showToastRef = useRef(showToast);
    useEffect(() => { showToastRef.current = showToast; }, [showToast]);
    const requestId = useRef(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [source, setSource] = useState<Source>("assets");
    const [folder, setFolder] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [items, setItems] = useState<MediaItem[]>([]);
    const [nextOffset, setNextOffset] = useState(0);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const root = source === "assets" ? "" : userId;
    const prefix = [root, folder].filter(Boolean).join("/");
    const load = useCallback(async (offset: number) => {
        const currentRequest = ++requestId.current;
        setLoading(true);
        const storage = getSupabaseBrowser().storage.from(source);
        const { data, error } = await storage.list(prefix, {
            limit: PAGE_SIZE, offset, sortBy: { column: "name", order: "asc" },
        });
        if (currentRequest !== requestId.current) return;
        setLoading(false);
        if (error) {
            setLoadError(true);
            showToastRef.current({ type: "error", message: `No se pudo cargar ${source}. Comprueba los permisos de Storage.` });
            return;
        }
        setLoadError(false);
        const next = ((data ?? []) as StorageEntry[]).flatMap((entry): MediaItem[] => {
            const path = prefix ? `${prefix}/${entry.name}` : entry.name;
            if (!entry.metadata) return [{ kind: "folder", name: entry.name, path, relativePath: [folder, entry.name].filter(Boolean).join("/") }];
            const pdf = source === "users" && /\.pdf$/i.test(entry.name);
            if (!IMAGE_EXTENSION.test(entry.name) && !pdf) return [];
            return [{ kind: "file", name: entry.name, path, url: storage.getPublicUrl(path).data.publicUrl, pdf }];
        });
        setItems(current => offset === 0 ? next : [...current, ...next]);
        setNextOffset(offset + (data?.length ?? 0));
        setHasMore((data?.length ?? 0) === PAGE_SIZE);
    }, [folder, prefix, source]);

    useEffect(() => {
        setItems([]);
        setNextOffset(0);
        setHasMore(false);
        setLoadError(false);
        void load(0);
        return () => { requestId.current += 1; };
    }, [load]);

    const selectSource = (next: Source) => {
        setFolder("");
        setSource(next);
    };

    const upload = async () => {
        if (!file || source !== "assets" || folder.split("/")[0] === "logos") return;
        setUploading(true);
        try {
            await uploadAssetImageFromBrowser(file, folder);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            await load(0);
            showToast({ type: "success", message: "Imagen subida a Assets." });
        } catch (error) {
            showToast({ type: "error", message: error instanceof AppError ? error.message : "No se pudo subir la imagen." });
        } finally {
            setUploading(false);
        }
    };

    const copy = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            showToast({ type: "success", message: "Enlace copiado." });
        } catch {
            showToast({ type: "error", message: "No se pudo copiar. Abre la imagen y copia su dirección." });
        }
    };

    const remove = (item: Extract<MediaItem, { kind: "file" }>) => {
        confirm({
            title: "Eliminar archivo",
            description: `¿Eliminar "${item.name}"? Su enlace dejará de funcionar.`,
            confirmText: "Eliminar",
            variant: "danger",
            action: async () => {
                const response = await deleteMediaImageAction(source, item.path);
                if (!response.success) {
                    showToast({ type: response.error.type, message: response.error.message });
                    return false;
                }
                await load(0);
                showToast({ type: "success", message: "Archivo eliminado." });
            },
        });
    };

    const segments = folder ? folder.split("/") : [];
    return <Section id="media" title="Galería">
        <div className="flex gap-2 border-b border-neutral-300 dark:border-neutral-700" role="tablist" aria-label="Buckets">
            {(["assets", "projects", "users"] as const).map(bucket => <button key={bucket} type="button" role="tab" aria-selected={source === bucket} onClick={() => selectSource(bucket)} className={`cursor-pointer border-b-2 px-4 py-2 text-sm font-medium ${source === bucket ? "border-blue-600 text-blue-600" : "border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"}`}>{bucket === "assets" ? "Assets" : bucket === "projects" ? "Proyectos" : "Perfil"}</button>)}
        </div>

        <nav aria-label="Carpetas" className="flex flex-wrap items-center gap-1 text-sm">
            <button type="button" onClick={() => setFolder("")} className="cursor-pointer text-blue-600 hover:underline">{source === "assets" ? "Assets" : source === "projects" ? "Proyectos" : "Perfil"}</button>
            {segments.map((segment, index) => <span key={`${segment}-${index}`} className="inline-flex items-center gap-1"><ChevronRight size={14} /><button type="button" onClick={() => setFolder(segments.slice(0, index + 1).join("/"))} className="cursor-pointer text-blue-600 hover:underline">{segment}</button></span>)}
        </nav>

        {source === "assets" && folder.split("/")[0] !== "logos" && <div className="rounded-md border border-neutral-300 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900/30">
            <div className="mx-auto grid max-w-2xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 sm:flex sm:flex-wrap sm:gap-3">
                <input ref={fileInputRef} id="media-upload" type="file" accept=".jpg,.jpeg,.png" disabled={uploading} onChange={event => setFile(event.target.files?.[0] ?? null)} className="peer sr-only" />
                <label htmlFor="media-upload" className={clsx(
                    "group inline-flex min-w-40 justify-self-start items-center justify-center gap-2 rounded-md border border-dashed bg-white px-5 py-2 text-sm font-medium text-neutral-800 transition duration peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:bg-neutral-800 dark:text-neutral-200",
                    uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-blue-500",
                    file ? "border-blue-500" : "border-neutral-300 dark:border-neutral-700",
                )}>
                    {file ? <CheckCircle size={18} className="text-green-600" /> : <Upload size={18} className="text-neutral-500 transition group-hover:text-blue-600" />}
                    {file ? "Archivo cargado" : "Elegir imagen"}
                </label>
                <div className="col-span-2 flex min-w-0 items-center gap-1 sm:min-w-32 sm:flex-1">
                    <span className="min-w-0 flex-1 truncate text-sm text-neutral-500 dark:text-neutral-400" title={file?.name}>{file?.name ?? "JPG o PNG · 5 MB"}</span>
                    {file && <button type="button" onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }} disabled={uploading} aria-label="Quitar archivo seleccionado" title="Quitar archivo" className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-red-400"><X size={18} /></button>}
                </div>
                <button type="button" onClick={upload} disabled={!file || uploading || loading || loadError} className="col-start-2 row-start-1 ml-auto inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-600">
                    <Upload size={18} /> {uploading ? "Subiendo..." : "Subir"}
                </button>
            </div>
        </div>}

        {loading && items.length === 0 && <p className="text-sm text-neutral-500">Cargando...</p>}
        {loadError && <div className="rounded-md border border-red-300 p-4 text-sm text-red-700 dark:border-red-800 dark:text-red-300">No se pudo mostrar {source}. Revisa el permiso SELECT del bucket. <button type="button" onClick={() => load(0)} className="cursor-pointer font-semibold underline">Reintentar</button></div>}
        {!loading && !loadError && items.length === 0 && <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-neutral-300 p-10 text-center text-neutral-500 dark:border-neutral-700"><Images size={28} /><p>Sin archivos.</p></div>}
        {items.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map(item => item.kind === "folder" ? <button key={`${source}:${item.path}`} type="button" onClick={() => setFolder(item.relativePath)} className="flex cursor-pointer items-center gap-3 rounded-md border border-neutral-300 bg-white p-5 text-left text-sm font-medium hover:border-blue-500 dark:border-neutral-700 dark:bg-neutral-900/30"><Folder size={24} className="text-blue-600" /><span className="truncate">{item.name}</span><ChevronRight size={16} className="ml-auto" /></button> :
                <article key={`${source}:${item.path}`} className="overflow-hidden rounded-md border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900/30">
                    <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800">{item.pdf ? <div className="flex h-full items-center justify-center"><FileText size={42} className="text-blue-600" /></div> : <Image src={item.url} alt={item.name} fill unoptimized={/\.svg$/i.test(item.name)} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />}</div>
                    <div className="space-y-3 p-3"><p className="truncate text-sm text-neutral-700 dark:text-neutral-300" title={item.path}>{item.name}</p><div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => copy(item.url)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"><Copy size={15} /> Copiar enlace</button>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${item.name}`} className="inline-flex items-center rounded-md border border-neutral-300 px-2 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><ExternalLink size={16} /></a>
                        <button type="button" onClick={() => remove(item)} className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-red-300 px-2 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/30" aria-label={`Eliminar ${item.name}`}><Trash2 size={15} /> Eliminar</button>
                    </div></div>
                </article>)}
        </div>}
        {hasMore && <div className="text-center"><button type="button" onClick={() => load(nextOffset)} disabled={loading} className="cursor-pointer rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800">{loading ? "Cargando..." : "Ver más"}</button></div>}
    </Section>;
}
