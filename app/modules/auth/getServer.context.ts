import 'server-only';

import { mapSupabaseError } from "@/app/lib/errors/ErrorMapper";
import { getSupabaseServerReadonly } from "@/app/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { redirect } from "next/navigation";

export const getCurrentUser = cache(async () => {
    const supabase = await getSupabaseServerReadonly();
    const { data, error } = await supabase.auth.getUser();

    if (error && error.name !== 'AuthSessionMissingError') {
        throw mapSupabaseError(error);
    }

    return { user: data.user, supabase };
});

export async function getServerAuthContext(): Promise<{ userId: string, supabase: SupabaseClient }> {
    const { user, supabase } = await getCurrentUser();

    if (!user) redirect('/');

    return {
        userId: user.id,
        supabase
    }
}
