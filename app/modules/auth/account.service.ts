import 'server-only';

import { AppError } from "@/app/lib/errors/AppError";
import { mapSupabaseError } from "@/app/lib/errors/ErrorMapper";
import { getSupabaseServer } from "@/app/lib/supabase/server";
import { ConfirmPhoneDto, UpdateEmailDto, UpdatePasswordDto, UpdatePhoneDto } from "./account.model";

async function getAuthenticatedSupabase() {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.getUser();

    if (error?.name === 'AuthSessionMissingError') throw new AppError('warning', 'Tu sesión ha expirado. Inicia sesión nuevamente.');
    if (error) throw mapSupabaseError(error);
    if (!data.user) throw new AppError('warning', 'Tu sesión ha expirado. Inicia sesión nuevamente.');

    return supabase;
}

export const AccountService = {
    requestEmailChange: async ({ email }: UpdateEmailDto) => {
        const supabase = await getAuthenticatedSupabase();
        const { error } = await supabase.auth.updateUser({ email });

        if (error) throw mapSupabaseError(error);
    },

    requestPasswordOtp: async () => {
        const supabase = await getAuthenticatedSupabase();
        const { error } = await supabase.auth.reauthenticate();

        if (error) throw mapSupabaseError(error);
    },

    requestPhoneChange: async ({ phone }: UpdatePhoneDto) => {
        const supabase = await getAuthenticatedSupabase();
        const { error } = await supabase.auth.updateUser({ phone });
        if (error) throw mapSupabaseError(error);
    },

    confirmPhoneChange: async ({ phone, token }: ConfirmPhoneDto) => {
        const supabase = await getAuthenticatedSupabase();
        const { error } = await supabase.auth.verifyOtp({ phone, token, type: "phone_change" });
        if (error) throw mapSupabaseError(error);
    },

    updatePassword: async ({ currentPassword, password, nonce }: UpdatePasswordDto) => {
        const supabase = await getAuthenticatedSupabase();
        const { error } = await supabase.auth.updateUser({
            password,
            nonce,
            current_password: currentPassword,
        });

        if (error) throw mapSupabaseError(error);
    },
};
