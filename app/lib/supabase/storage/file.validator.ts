import { AppError } from "@/app/lib/errors/AppError";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function validateFile(file: File, allowedMime: readonly string[]) {
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
        throw new AppError('error', 'El archivo debe tener entre 1 byte y 5 MB');
    }

    if (!allowedMime.includes(file.type)) {
        throw new AppError('error', 'Formato de archivo no permitido');
    }

    const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    const isPng = bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
    const isJpeg = bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const isPdf = bytes.length >= 5 && [37, 80, 68, 70, 45].every((byte, index) => bytes[index] === byte);

    if ((file.type === 'image/png' && !isPng)
        || (file.type === 'image/jpeg' && !isJpeg)
        || (file.type === 'application/pdf' && !isPdf)) {
        throw new AppError('error', 'El contenido del archivo no coincide con su formato');
    }
}
