export type MediaSource = "projects" | "assets" | "users";

export const mediaSources: MediaSource[] = ["assets", "projects", "users"];

export function isMediaSource(source: string | null | undefined): source is MediaSource {
    return mediaSources.some(value => value === source);
}

export function normalizeMediaFolder(folder: string | string[] | null | undefined) {
    if (typeof folder !== "string") return "";

    const segments = folder.split("/");
    const isInvalid = segments.some(segment =>
        !segment || segment === "." || segment === ".." || segment.includes("\\"),
    );

    return isInvalid ? "" : folder;
}

export function getMediaUrl(source: MediaSource, folder: string) {
    const params = new URLSearchParams();
    if (source !== "assets") params.set("source", source);
    if (folder) params.set("folder", folder);

    const query = params.toString();
    return query ? `/dashboard/media?${query}` : "/dashboard/media";
}
