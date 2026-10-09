import { describe, expect, it } from 'vitest';
import { contactFormDataSchema } from '../app/modules/contacts/contact.schema';
import { formDataToObject } from '../app/lib/forms/zod';
import { validateFile } from '../app/lib/supabase/storage/file.validator';
import { toCamelCase, toSnakeCase } from '../app/utils/caseConverter';
import { isValidUploadPath } from '../app/lib/supabase/storage/file.path';
import { skillCreateServerSchema } from '../app/modules/skills/skills.schema';
import { sanitizeSkillLogo } from '../app/modules/skills/skills.svg';

describe('límites de datos', () => {
    it('convierte las claves de filas sin alterar arreglos ni fechas', () => {
        const date = new Date('2026-01-01T00:00:00Z');
        expect(toCamelCase({ user_id: 'u1', metadata: { created_at: date }, stack: ['Next.js'] }))
            .toEqual({ userId: 'u1', metadata: { createdAt: date }, stack: ['Next.js'] });
        expect(toSnakeCase({ userId: 'u1', imgUrl: '/image.png' }))
            .toEqual({ user_id: 'u1', img_url: '/image.png' });
    });

    it('convierte el booleano de contacto recibido como FormData', () => {
        const form = new FormData();
        for (const [key, value] of Object.entries({
            title: 'Correo', value: 'contacto@example.com', category: 'direct',
            type: 'email', linkUrl: '', isPrimary: 'false',
        })) form.set(key, value);

        expect(contactFormDataSchema.parse(formDataToObject(form)).isPrimary).toBe(false);
        form.set('isPrimary', 'true');
        expect(contactFormDataSchema.parse(formDataToObject(form)).isPrimary).toBe(true);
    });

    it('valida el booleano y el logo obligatorios de una habilidad', () => {
        const logo = new File(['<svg xmlns="http://www.w3.org/2000/svg"/>'], 'logo.svg', { type: 'image/svg+xml' });
        const fields = { title: 'TypeScript', category: 'Lenguajes', logo };
        expect(skillCreateServerSchema.parse({ ...fields, isPrimary: 'false' }).isPrimary).toBe(false);
        expect(skillCreateServerSchema.parse({ ...fields, isPrimary: 'true' }).isPrimary).toBe(true);
        expect(skillCreateServerSchema.safeParse({ title: fields.title, category: fields.category, isPrimary: 'false' }).success).toBe(false);
    });

    it('limpia código activo de un logo SVG antes de subirlo', async () => {
        const logo = new File(['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle cx="10" cy="10" r="5" onload="alert(1)"/></svg>'], 'logo.svg', { type: 'image/svg+xml' });
        const clean = (await sanitizeSkillLogo(logo)).toString('utf8');
        expect(clean).toContain('<circle');
        expect(clean).not.toContain('<script');
        expect(clean).not.toContain('onload');
    });

    it('rechaza referencias externas en SVG', async () => {
        const logo = new File(['<svg xmlns="http://www.w3.org/2000/svg"><rect fill="url(https://example.com/color)"/></svg>'], 'logo.svg', { type: 'image/svg+xml' });
        await expect(sanitizeSkillLogo(logo)).rejects.toThrow('recursos externos');
    });

    it('conserva degradados y referencias internas de un logo', async () => {
        const logo = new File(['<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g"><stop stop-color="#fff"/></linearGradient></defs><path d="M0 0h10v10z" fill="url(#g)"/></svg>'], 'logo.svg', { type: 'image/svg+xml' });
        const clean = (await sanitizeSkillLogo(logo)).toString('utf8');
        expect(clean).toContain('linearGradient');
        expect(clean).toContain('url(#g)');
    });

    it('rechaza archivos cuyo contenido no coincide con el MIME', async () => {
        const fakePng = new File(['<script>alert(1)</script>'], 'image.png', { type: 'image/png' });
        await expect(validateFile(fakePng, ['image/png'])).rejects.toThrow('contenido del archivo');

        const png = new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'image.png', { type: 'image/png' });
        await expect(validateFile(png, ['image/png'])).resolves.toBeUndefined();
    });

    it('rechaza archivos vacíos y mayores de 5 MB', async () => {
        const empty = new File([], 'cv.pdf', { type: 'application/pdf' });
        const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'cv.pdf', { type: 'application/pdf' });
        await expect(validateFile(empty, ['application/pdf'])).rejects.toThrow('5 MB');
        await expect(validateFile(oversized, ['application/pdf'])).rejects.toThrow('5 MB');
    });

    it('solo acepta rutas de Storage bajo el usuario y bucket esperados', () => {
        const owner = '00000000-0000-4000-8000-000000000001';
        const filename = 'avatar-11111111-1111-4111-8111-111111111111.jpg';
        expect(isValidUploadPath('avatar', owner, `${owner}/avatars/${filename}`)).toBe(true);
        expect(isValidUploadPath('avatar', owner, `otro/avatars/${filename}`)).toBe(false);
        expect(isValidUploadPath('avatar', owner, `${owner}/avatars/../${filename}`)).toBe(false);
        expect(isValidUploadPath('cv', owner, `${owner}/cv/${filename}`)).toBe(false);
    });
});
