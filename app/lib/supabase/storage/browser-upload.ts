import { AppError } from '@/app/lib/errors/AppError';
import { getSupabaseBrowser } from '../browser';
import { FILE_CONFIG, type FileType } from './file.config';
import { generateFileName } from './file.naming';
import { validateFile } from './file.validator';

export async function uploadFileFromBrowser(file: File, type: FileType): Promise<string> {
    const config = FILE_CONFIG[type];
    return uploadImage(file, config.bucket, config.mime, userId => config.getPath(userId));
}

export async function uploadAssetImageFromBrowser(file: File, folder: string): Promise<string> {
    const segments = folder ? folder.split('/') : [];
    if (folder.length > 400 || segments.some(segment => !segment || segment === '.' || segment === '..')) {
        throw new AppError('warning', 'La carpeta seleccionada no es válida.');
    }

    return uploadImage(file, 'assets', FILE_CONFIG.projectImage.mime, () => {
        if (segments[0] === 'logos') {
            throw new AppError('warning', 'Los logos se cambian desde el formulario de Habilidades.');
        }
        return folder;
    });
}

async function uploadImage(file: File, bucket: string, mime: readonly string[], getFolder: (userId: string) => string): Promise<string> {
    await validateFile(file, mime);
    const supabase = getSupabaseBrowser();
    const { data, error: authError } = await supabase.auth.getUser();
    if (authError || !data.user) throw new AppError('warning', 'Tu sesión ha expirado. Inicia sesión nuevamente.');

    const path = generateFileName(getFolder(data.user.id), file);
    const { error } = await supabase.storage.from(bucket)
        .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw new AppError('error', `No se pudo subir el archivo a ${bucket}. Revisa el permiso INSERT y el límite del bucket.`);
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
