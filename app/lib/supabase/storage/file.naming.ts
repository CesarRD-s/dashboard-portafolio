import { MIME_TO_EXT } from "./file.config";
import { AppError } from "@/app/lib/errors/AppError";

export function generateFileName(
    basePath: string,
    file: File,
): string {

    const ext = MIME_TO_EXT[file.type];

    if (!ext) {
        throw new AppError('error', 'Tipo de archivo no soportado');
    }

    // nombre original
    const safeName = file.name.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9-_]/g, '_') || 'archivo';

    const filename = `${safeName}-${crypto.randomUUID()}.${ext}`;
    return basePath ? `${basePath}/${filename}` : filename;
}
