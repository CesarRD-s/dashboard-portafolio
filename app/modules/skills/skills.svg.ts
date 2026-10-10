import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { AppError } from '@/app/lib/errors/AppError';
import { MAX_SKILL_LOGO_BYTES } from './skills.logo-config';

export async function sanitizeSkillLogo(file: File): Promise<Buffer> {
    if (file.type !== 'image/svg+xml' || !file.name.toLowerCase().endsWith('.svg')) {
        throw new AppError('warning', 'El logo debe ser un archivo SVG');
    }
    if (file.size === 0 || file.size > MAX_SKILL_LOGO_BYTES) {
        throw new AppError('warning', 'El logo debe tener como máximo 1 MB');
    }

    const window = new JSDOM('').window;
    try {
        const purify = DOMPurify(window);
        const clean = purify.sanitize(await file.text(), {
            USE_PROFILES: { svg: true, svgFilters: true },
            FORBID_TAGS: ['script', 'foreignObject', 'style', 'image'],
            FORBID_ATTR: ['style'],
        });
        if (!clean.trim().startsWith('<svg')) throw new AppError('warning', 'El SVG no es válido');

        const parsed = new JSDOM(clean, { contentType: 'image/svg+xml' });
        try {
            const root = parsed.window.document.documentElement;
            if (root.localName !== 'svg' || root.namespaceURI !== 'http://www.w3.org/2000/svg') {
                throw new AppError('warning', 'El SVG no es válido');
            }
            for (const element of [root, ...Array.from(root.querySelectorAll('*'))]) {
                for (const attribute of Array.from(element.attributes)) {
                    if (['href', 'xlink:href'].includes(attribute.name) && !attribute.value.startsWith('#')) {
                        throw new AppError('warning', 'El SVG no puede incluir recursos externos');
                    }
                    for (const match of attribute.value.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/gi)) {
                        if (!match[1]?.startsWith('#')) {
                            throw new AppError('warning', 'El SVG no puede incluir recursos externos');
                        }
                    }
                }
            }
        } finally {
            parsed.window.close();
        }

        const bytes = Buffer.from(clean, 'utf8');
        if (bytes.length === 0 || bytes.length > MAX_SKILL_LOGO_BYTES) {
            throw new AppError('warning', 'El logo limpio supera 1 MB');
        }
        return bytes;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError('warning', 'El SVG no es válido');
    } finally {
        window.close();
    }
}
