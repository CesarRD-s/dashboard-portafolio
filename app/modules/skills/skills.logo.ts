import { AppError } from '@/app/lib/errors/AppError';
import { getSkillLogoExtension, MAX_SKILL_LOGO_BYTES } from './skills.logo-config';

export async function prepareSkillLogo(file: File): Promise<{
    content: Buffer;
    contentType: string;
    extension: string;
}> {
    const extension = getSkillLogoExtension(file);
    if (!extension || file.size === 0 || file.size > MAX_SKILL_LOGO_BYTES) {
        throw new AppError('warning', 'El logo debe ser SVG, PNG, WebP o JPEG y no superar 1 MB');
    }

    if (extension === 'svg') {
        const { sanitizeSkillLogo } = await import('./skills.svg');
        return { content: await sanitizeSkillLogo(file), contentType: file.type, extension };
    }

    const content = Buffer.from(await file.arrayBuffer());
    const isPng = extension === 'png'
        && content.length >= 24
        && content.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        && content.readUInt32BE(8) === 13
        && content.toString('ascii', 12, 16) === 'IHDR'
        && content.readUInt32BE(16) > 0
        && content.readUInt32BE(20) > 0;
    const isWebp = extension === 'webp'
        && content.length >= 16
        && content.toString('ascii', 0, 4) === 'RIFF'
        && content.toString('ascii', 8, 12) === 'WEBP'
        && ['VP8 ', 'VP8L', 'VP8X'].includes(content.toString('ascii', 12, 16));
    const isJpeg = extension === 'jpg'
        && content.length >= 4
        && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;

    if (!isPng && !isWebp && !isJpeg) {
        throw new AppError('warning', 'El contenido del logo no coincide con su formato');
    }

    return { content, contentType: file.type, extension };
}
