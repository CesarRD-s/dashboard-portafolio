import 'server-only';

import { toCamelCase, toSnakeCase } from "@/app/utils/caseConverter";
import { getServerAuthContext } from "../auth/getServer.context";
import { Contact } from "./contact.model";
import type { ContactForm } from "./contact.schema";
import { mapSupabaseError } from "@/app/lib/errors/ErrorMapper";
import { AppError } from "@/app/lib/errors/AppError";
import { notFound } from "next/navigation";

export const ContactService = {
    getOne: async (id: string): Promise<Contact> => {
        const { userId, supabase } = await getServerAuthContext();
        const { data, error } = await supabase
            .from('contacts')
            .select('id, title, value, category, type, link_url, is_primary, created_at')
            .eq('id', id)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) { throw mapSupabaseError(error) }
        if (!data) notFound();

        return toCamelCase(data) as Contact;
    },
    getAll: async (): Promise<Contact[]> => {
        const { supabase, userId } = await getServerAuthContext();
        const { data, error } = await supabase.from('contacts')
            .select('id, title, value, category, type, link_url, is_primary, created_at')
            .eq('user_id', userId).order('created_at', { ascending: false });
        if (error) throw mapSupabaseError(error);
        return toCamelCase(data ?? []) as Contact[];
    },
    create: async (dto: ContactForm): Promise<void> => {
        const { supabase, userId } = await getServerAuthContext();
        const { error } = await supabase.from('contacts').insert([toSnakeCase({ ...dto, userId })]);

        if (error) { throw mapSupabaseError(error) }
    },
    update: async (id: string, dto: ContactForm) => {
        const { supabase, userId } = await getServerAuthContext();
        const { data, error } = await supabase
            .from('contacts')
            .update(toSnakeCase(dto))
            .eq('id', id)
            .eq('user_id', userId)
            .select('id')
            .maybeSingle();
        if (error) { throw mapSupabaseError(error) }
        if (!data) throw new AppError('warning', 'El contacto ya no existe');
    },
    delete: async (id: string) => {
        const { userId, supabase } = await getServerAuthContext();
        const { data, error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id)
            .eq('user_id', userId)
            .select('id')
            .maybeSingle();
        if (error) { throw mapSupabaseError(error) }
        if (!data) throw new AppError('warning', 'El contacto ya no existe');
    },
}
