"use server";

import { safeAction } from "@/app/lib/errors/SafeActions";
import { MediaService } from "../media.service";
import { z } from "zod";

const deleteMediaSchema = z.object({
    bucket: z.enum(["projects", "assets", "users"]),
    path: z.string().min(1),
});

export const deleteMediaImageAction = safeAction(async (bucket: "projects" | "assets" | "users", path: string) => {
    const input = deleteMediaSchema.parse({ bucket, path });
    await MediaService.deleteImage(input.bucket, input.path);
});
