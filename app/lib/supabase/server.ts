import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export async function getSupabaseServer() {
    const cookieStore = await cookies();
    return createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll: () => {
                return cookieStore.getAll();
            },
            setAll: (cookies) => {
                cookies.forEach(({ name, value, options }) => {
                    cookieStore.set(name, value, options);
                });
            }
        }
    });
}

export async function getSupabaseServerReadonly() {
    const cookieStore = await cookies();
    return createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll: () => {
                return cookieStore.getAll();
            },
            setAll: () => { }
        }
    });
}
