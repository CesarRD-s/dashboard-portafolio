import 'server-only';

import { notFound } from 'next/navigation';
import { AppError } from '@/app/lib/errors/AppError';
import { mapSupabaseError } from '@/app/lib/errors/ErrorMapper';
import { removePublicFileStorage } from '@/app/lib/supabase/storage/uploadFile';
import { toCamelCase, toSnakeCase } from '@/app/utils/caseConverter';
import { getServerAuthContext } from '../auth/getServer.context';
import type { Skill } from './skills.model';
import type { SkillCreateInput, SkillUpdateInput } from './skills.schema';
import { sanitizeSkillLogo } from './skills.svg';

export const SkillsService = {
    getAll: async (): Promise<Skill[]> => {
        const { userId, supabase } = await getServerAuthContext();
        const { data, error } = await supabase.from('skills').select('*')
            .eq('user_id', userId)
            .order('is_primary', { ascending: false })
            .order('created_at', { ascending: false });
        if (error) throw mapSupabaseError(error);
        return toCamelCase(data) as Skill[];
    },

    getOne: async (id: string): Promise<Skill> => {
        const { userId, supabase } = await getServerAuthContext();
        const { data, error } = await supabase.from('skills').select('*')
            .eq('id', id).eq('user_id', userId).maybeSingle();
        if (error) throw mapSupabaseError(error);
        if (!data) notFound();
        return toCamelCase(data) as Skill;
    },

    create: async ({ logo, ...fields }: SkillCreateInput): Promise<void> => {
        const { userId, supabase } = await getServerAuthContext();
        const logoUrl = await uploadSkillLogo(supabase, userId, logo);
        try {
            const { error } = await supabase.from('skills').insert(toSnakeCase({ ...fields, userId, logoUrl }));
            if (error) throw mapSupabaseError(error);
        } catch (error) {
            await removePublicFileStorage(supabase, 'assets', logoUrl);
            throw error;
        }
    },

    update: async (id: string, { logo, ...fields }: SkillUpdateInput): Promise<void> => {
        const { userId, supabase } = await getServerAuthContext();
        const { data: skill, error: lookupError } = await supabase.from('skills').select('logo_url')
            .eq('id', id).eq('user_id', userId).maybeSingle();
        if (lookupError) throw mapSupabaseError(lookupError);
        if (!skill) throw new AppError('warning', 'La habilidad ya no existe');

        const logoUrl = logo ? await uploadSkillLogo(supabase, userId, logo) : undefined;
        try {
            const { data, error } = await supabase.from('skills')
                .update(toSnakeCase({ ...fields, ...(logoUrl ? { logoUrl } : {}) }))
                .eq('id', id).eq('user_id', userId).select('id').maybeSingle();
            if (error) throw mapSupabaseError(error);
            if (!data) throw new AppError('warning', 'La habilidad ya no existe');
        } catch (error) {
            await removePublicFileStorage(supabase, 'assets', logoUrl);
            throw error;
        }

        if (logoUrl) await removeOwnedSkillLogo(supabase, userId, skill.logo_url);
    },

    delete: async (id: string): Promise<void> => {
        const { userId, supabase } = await getServerAuthContext();
        const { data: skill, error: lookupError } = await supabase.from('skills').select('logo_url')
            .eq('id', id).eq('user_id', userId).maybeSingle();
        if (lookupError) throw mapSupabaseError(lookupError);
        if (!skill) throw new AppError('warning', 'La habilidad ya no existe');

        const { data, error } = await supabase.from('skills').delete()
            .eq('id', id).eq('user_id', userId).select('id').maybeSingle();
        if (error) throw mapSupabaseError(error);
        if (!data) throw new AppError('warning', 'La habilidad ya no existe');
        await removeOwnedSkillLogo(supabase, userId, skill.logo_url);
    },
};

async function uploadSkillLogo(
    supabase: Awaited<ReturnType<typeof getServerAuthContext>>['supabase'],
    userId: string,
    file: File,
): Promise<string> {
    const content = await sanitizeSkillLogo(file);
    const path = `logos/${userId}/${crypto.randomUUID()}.svg`;
    const storage = supabase.storage.from('assets');
    const { error } = await storage.upload(path, content, { contentType: 'image/svg+xml', upsert: false });
    if (error) throw mapSupabaseError(error);
    return storage.getPublicUrl(path).data.publicUrl;
}

async function removeOwnedSkillLogo(
    supabase: Awaited<ReturnType<typeof getServerAuthContext>>['supabase'],
    userId: string,
    publicUrl: string | null,
): Promise<void> {
    if (!publicUrl) return;
    try {
        const url = new URL(publicUrl);
        const origin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin;
        const prefix = `/storage/v1/object/public/assets/logos/${userId}/`;
        if (url.origin !== origin || !url.pathname.startsWith(prefix)) return;
        await removePublicFileStorage(supabase, 'assets', publicUrl);
    } catch {
        return;
    }
}
