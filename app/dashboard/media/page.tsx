import { getServerAuthContext } from "@/app/modules/auth/getServer.context";
import { isMediaSource, normalizeMediaFolder } from "@/app/modules/media/media.location";
import { MediaView } from "./ui/media.view";

export const metadata = { title: "Medios | Dashboard" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MediaPage({ searchParams }: { searchParams: SearchParams }) {
    const [{ userId }, params] = await Promise.all([
        getServerAuthContext(),
        searchParams,
    ]);
    const source = typeof params.source === "string" && isMediaSource(params.source)
        ? params.source
        : "assets";

    return (
        <MediaView
            userId={userId}
            initialSource={source}
            initialFolder={normalizeMediaFolder(params.folder)}
        />
    );
}
