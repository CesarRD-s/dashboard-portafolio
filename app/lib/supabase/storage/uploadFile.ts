import 'server-only';

import { SupabaseClient } from '@supabase/supabase-js';
import { FILE_CONFIG, MIME_TO_EXT, type FileType } from './file.config';
import { AppError } from '../../errors/AppError';
import { isValidUploadPath } from './file.path';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function resolveUploadedFile(
    supabase: SupabaseClient,
    type: FileType,
    userId: string,
    path: string,
): Promise<string> {
    const config = FILE_CONFIG[type];
    if (!isValidUploadPath(type, userId, path)) throw new AppError('warning', 'Ruta de archivo inválida');

    const { data, error } = await supabase.storage.from(config.bucket).info(path);
    if (error || !data) throw new AppError('warning', 'El archivo no existe o no tienes permiso para usarlo');
    if (!data.size || data.size > MAX_FILE_SIZE || !data.contentType
        || !(config.mime as readonly string[]).includes(data.contentType)
        || !path.endsWith(`.${MIME_TO_EXT[data.contentType]}`)) {
        throw new AppError('warning', 'El archivo no cumple los requisitos de tamaño o formato');
    }

    return supabase.storage.from(config.bucket).getPublicUrl(path).data.publicUrl;
}

export async function removePublicFileStorage(
    supabase: SupabaseClient,
    bucket: string,
    publicUrl: string | null | undefined,
): Promise<void> {
    if (!publicUrl) return;

    try {
        const url = new URL(publicUrl);
        const configuredOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin;
        const prefix = `/storage/v1/object/public/${bucket}/`;

        if (url.origin !== configuredOrigin || !url.pathname.startsWith(prefix)) return;

        const path = decodeURIComponent(url.pathname.slice(prefix.length));
        if (!path) return;

        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) console.error('No se pudo limpiar el archivo de Storage', error);
    } catch (error) {
        // Una falla de limpieza no debe convertir una escritura ya confirmada en error.
        console.error('No se pudo limpiar el archivo de Storage', error);
    }
}
