import "server-only";

import { AppError } from "@/app/lib/errors/AppError";
import { mapSupabaseError } from "@/app/lib/errors/ErrorMapper";
import { getServerAuthContext } from "@/app/modules/auth/getServer.context";

export type MediaBucket = "projects" | "assets" | "users";

const IMAGE_EXTENSION = /\.(svg|png|jpe?g|webp|gif|avif)$/i;

export const MediaService = {
    deleteImage: async (bucket: MediaBucket, path: string): Promise<void> => {
        const { userId, supabase } = await getServerAuthContext();
        const segments = path.split("/");
        if (path.length > 512 || segments.some(segment => !segment || segment === "." || segment === "..")
            || !(IMAGE_EXTENSION.test(path) || (bucket === "users" && /\.pdf$/i.test(path)))) {
            throw new AppError("warning", "Ruta de archivo inválida.");
        }
        if (bucket === "projects" && !path.startsWith(`${userId}/gallery/`)) {
            throw new AppError("warning", "No puedes eliminar esta imagen de proyecto.");
        }
        if (bucket === "assets" && segments[0] === "logos" && segments[1] !== userId) {
            throw new AppError("warning", "No puedes eliminar el logo de otra cuenta.");
        }
        if (bucket === "users" && !(path.startsWith(`${userId}/avatars/`) || path.startsWith(`${userId}/cv/`))) {
            throw new AppError("warning", "No puedes eliminar este archivo de perfil.");
        }

        const storage = supabase.storage.from(bucket);
        const publicUrl = storage.getPublicUrl(path).data.publicUrl;
        const reference = bucket === "projects"
            ? await supabase.from("projects").select("id").eq("user_id", userId).eq("img_url", publicUrl).limit(1).maybeSingle()
            : bucket === "assets"
                ? await supabase.from("skills").select("id").eq("user_id", userId).eq("logo_url", publicUrl).limit(1).maybeSingle()
                : await supabase.from("profiles").select("id").eq("id", userId)
                    .eq(segments[1] === "cv" ? "cv_url" : "avatar_url", publicUrl).limit(1).maybeSingle();
        if (reference.error) throw mapSupabaseError(reference.error);
        if (reference.data) {
            throw new AppError("warning", bucket === "projects"
                ? "Cambia la imagen desde el formulario del proyecto."
                : bucket === "assets"
                    ? "Cambia el logo desde el formulario de Habilidades."
                    : "Cambia este archivo desde el formulario del perfil.");
        }

        const { error } = await storage.remove([path]);
        if (error) throw mapSupabaseError(error);
    },
};
