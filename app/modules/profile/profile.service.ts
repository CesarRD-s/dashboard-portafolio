import 'server-only';

import { OverviewData, Profile } from "./profile.model";
import type { ProfileUpdateInput } from "./profile.schema";
import { AppError } from "@/app/lib/errors/AppError";
import { mapSupabaseError } from "@/app/lib/errors/ErrorMapper";
import { toCamelCase, toSnakeCase } from "@/app/utils/caseConverter";
import { removePublicFileStorage, resolveUploadedFile } from "@/app/lib/supabase/storage/uploadFile";
import { getServerAuthContext } from "../auth/getServer.context";

export const ProfileService = {
    getOne: async (): Promise<Profile | null> => {
        const { userId, supabase } = await getServerAuthContext()

        const { data, error } = await supabase.from('profiles')
            .select('author, short_bio, tag_line, profession, year, avatar_url, cv_url, updated_at')
            .eq('id', userId).maybeSingle();

        if (error) { throw mapSupabaseError(error) }
        if (!data) return null;

        return toCamelCase(data) as Profile
    },


    update: async (dto: ProfileUpdateInput) => {
        const { userId, supabase } = await getServerAuthContext()

        const { avatarPath, cvPath, year, ...rest } = dto;
        const updateData: Record<string, unknown> = { ...rest };

        if (year !== undefined) {
            const parsed = parseInt(year);
            if (isNaN(parsed)) { throw new AppError('error', 'Formato de año inválido'); }
            updateData.year = parsed;
        }

        const { data: oldFiles, error: lookupError } = await supabase.from('profiles')
            .select('avatar_url, cv_url').eq('id', userId).maybeSingle();
        if (lookupError) throw mapSupabaseError(lookupError);

        let avatarUrl: string | undefined;
        let cvUrl: string | undefined;
        try {
            if (avatarPath) {
                avatarUrl = await resolveUploadedFile(supabase, 'avatar', userId, avatarPath);
                updateData.avatarUrl = avatarUrl;
            }

            if (cvPath) {
                cvUrl = await resolveUploadedFile(supabase, 'cv', userId, cvPath);
                updateData.cvUrl = cvUrl;
            }

            const mutation = oldFiles
                ? supabase.from('profiles').update(toSnakeCase(updateData)).eq('id', userId)
                : supabase.from('profiles').insert(toSnakeCase({
                    id: userId,
                    ...updateData,
                    avatarUrl: avatarUrl ?? '',
                    cvUrl: cvUrl ?? '',
                }));
            const { data, error } = await mutation.select('id').maybeSingle();
            if (error) throw mapSupabaseError(error);
            if (!data) throw new AppError('warning', 'No se pudo guardar el perfil');
        } catch (error) {
            await Promise.all([
                removePublicFileStorage(supabase, 'users', avatarUrl),
                removePublicFileStorage(supabase, 'users', cvUrl),
            ]);
            throw error;
        }

        await Promise.all([
            avatarUrl && oldFiles && avatarUrl !== oldFiles.avatar_url && removePublicFileStorage(supabase, 'users', oldFiles.avatar_url),
            cvUrl && oldFiles && cvUrl !== oldFiles.cv_url && removePublicFileStorage(supabase, 'users', oldFiles.cv_url),
        ]);
    },

    overview: async (): Promise<OverviewData> => {
        const { userId, supabase } = await getServerAuthContext()

        const [projects, skills, contacts, lastProject, lastContact] = await Promise.all([
            supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', userId),
            supabase.from('skills').select('*', { count: 'exact', head: true }).eq('user_id', userId),
            supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', userId),
            supabase.from('projects').select('id, title, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
            supabase.from('contacts').select('id, title, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(3),
        ])

        for (const result of [projects, skills, contacts, lastProject, lastContact]) {
            if (result.error) throw mapSupabaseError(result.error);
        }

        const recentActivity = [
            ...(lastProject.data ?? []).map(project => ({
                id: project.id,
                type: 'project' as const,
                title: project.title,
                createdAt: project.created_at,
            })),
            ...(lastContact.data ?? []).map(contact => ({
                id: contact.id,
                type: 'contact' as const,
                title: contact.title,
                createdAt: contact.created_at,
            })),
        ].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5);

        return {
            stats: [
                { title: 'Proyectos', description: "Proyectos publicados", count: projects.count || 0 },
                { title: 'Habilidades', description: "Habilidades publicadas", count: skills.count || 0 },
                { title: 'Contactos', description: "Contactos publicados", count: contacts.count || 0 },
            ],
            recentActivity,
        }
    }
}
