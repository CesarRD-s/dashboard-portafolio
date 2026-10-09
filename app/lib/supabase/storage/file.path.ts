import { FILE_CONFIG, MIME_TO_EXT, type FileType } from './file.config';

export function isValidUploadPath(type: FileType, userId: string, path: string): boolean {
    const config = FILE_CONFIG[type];
    const prefix = `${config.getPath(userId)}/`;
    if (!path.startsWith(prefix)) return false;

    const filename = path.slice(prefix.length);
    const match = /^[a-zA-Z0-9_-]+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|pdf)$/.exec(filename);
    if (!match) return false;

    return config.mime.some(mime => MIME_TO_EXT[mime] === match[1]);
}
