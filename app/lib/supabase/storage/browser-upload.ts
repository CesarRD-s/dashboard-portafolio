import { AppError } from '@/app/lib/errors/AppError';
import { getSupabaseBrowser } from '../browser';
import { FILE_CONFIG, type FileType } from './file.config';
import { generateFileName } from './file.naming';
import { validateFile } from './file.validator';

export async function uploadFileFromBrowser(file: File, type: FileType): Promise<string> {
    const config = FILE_CONFIG[type];
    await validateFile(file, config.mime);

    const supabase = getSupabaseBrowser();
    const { data, error: authError } = await supabase.auth.getUser();
    if (authError || !data.user) throw new AppError('warning', 'Tu sesión ha expirado. Inicia sesión nuevamente.');

    const path = generateFileName(config.getPath(data.user.id), file);
    const { error } = await supabase.storage.from(config.bucket)
        .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw new AppError('error', 'No se pudo subir el archivo. Inténtalo de nuevo.');

    return path;
}

export async function removeUploadedFileFromBrowser(type: FileType, path?: string): Promise<void> {
    if (!path) return;
    try {
        const { error } = await getSupabaseBrowser().storage.from(FILE_CONFIG[type].bucket).remove([path]);
        if (error) console.error('No se pudo limpiar el archivo tras un error', error);
    } catch (error) {
        console.error('No se pudo limpiar el archivo tras un error', error);
    }
}
