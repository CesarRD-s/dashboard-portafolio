import 'server-only';

import { Project } from "./projects.model";
import type { ProjectCreateInput, ProjectUpdateInput } from "./projects.schema";
import { mapSupabaseError } from "@/app/lib/errors/ErrorMapper";
import { toCamelCase, toSnakeCase } from "@/app/utils/caseConverter";
import { removePublicFileStorage, resolveUploadedFile } from "@/app/lib/supabase/storage/uploadFile";
import { getServerAuthContext } from "../auth/getServer.context";
import { AppError } from "@/app/lib/errors/AppError";
import { notFound } from "next/navigation";

export const ProjectsService = {
    // ==========================================================
    getAll: async (): Promise<Project[]> => {
        const { userId, supabase } = await getServerAuthContext()
        const { data, error } = await supabase.from('projects')
            .select('*')
            .eq('user_id', userId).order('created_at', { ascending: false })

        if (error) throw mapSupabaseError(error)

        return toCamelCase(data) as Project[]
    },

    // ==========================================================
    getOne: async (id: string): Promise<Project> => {
        const { userId, supabase } = await getServerAuthContext()
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .maybeSingle()

        if (error) throw mapSupabaseError(error)
        if (!data) notFound();

        return toCamelCase(data) as Project
    },

    // ==========================================================
    create: async (dto: ProjectCreateInput): Promise<void> => {
        const { userId, supabase } = await getServerAuthContext()

        const { imgPath, stack, ...rest } = dto
        const newProject: Record<string, unknown> = { ...rest }

        if (stack?.trim()) {
            newProject.stack = stack.split(',').map(str => str.trim()).filter(Boolean)
        }

        newProject.userId = userId

        let uploadedUrl: string | undefined;
        try {
            uploadedUrl = await resolveUploadedFile(supabase, 'projectImage', userId, imgPath);
            newProject.imgUrl = uploadedUrl;

            const { error } = await supabase.from('projects').insert([toSnakeCase(newProject)]);
            if (error) throw mapSupabaseError(error);
        } catch (error) {
            await removePublicFileStorage(supabase, 'projects', uploadedUrl);
            throw error;
        }
    },

    // ==========================================================
    delete: async (id: string): Promise<void> => {
        const { userId, supabase } = await getServerAuthContext()

        const { data: project, error: lookupError } = await supabase
            .from('projects').select('img_url').eq('id', id).eq('user_id', userId).maybeSingle();
        if (lookupError) throw mapSupabaseError(lookupError);
        if (!project) throw new AppError('warning', 'El proyecto ya no existe');

        const { data, error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)
            .select('id')
            .maybeSingle();

        if (error) throw mapSupabaseError(error)
        if (!data) throw new AppError('warning', 'El proyecto ya no existe');
        await removePublicFileStorage(supabase, 'projects', project.img_url);
    },

    // ==========================================================
    update: async (id: string, dto: ProjectUpdateInput): Promise<void> => {
        const { userId, supabase } = await getServerAuthContext()

        const { imgPath, stack, ...rest } = dto
        const updateData: Record<string, unknown> = { ...rest }

        if (stack?.trim()) {
            updateData.stack = stack.split(',').map(str => str.trim()).filter(Boolean)
        }

        const { data: project, error: lookupError } = await supabase
            .from('projects').select('img_url').eq('id', id).eq('user_id', userId).maybeSingle();
        if (lookupError) throw mapSupabaseError(lookupError);
        if (!project) throw new AppError('warning', 'El proyecto ya no existe');

        let uploadedUrl: string | undefined;
        try {
            if (imgPath) {
                uploadedUrl = await resolveUploadedFile(supabase, 'projectImage', userId, imgPath);
                updateData.imgUrl = uploadedUrl;
            }

            const { data, error } = await supabase.from('projects')
                .update(toSnakeCase(updateData)).eq('id', id).eq('user_id', userId)
                .select('id').maybeSingle();

            if (error) throw mapSupabaseError(error);
            if (!data) throw new AppError('warning', 'El proyecto ya no existe');
        } catch (error) {
            if (uploadedUrl !== project.img_url) await removePublicFileStorage(supabase, 'projects', uploadedUrl);
            throw error;
        }

        if (uploadedUrl) await removePublicFileStorage(supabase, 'projects', project.img_url);
    },
}
