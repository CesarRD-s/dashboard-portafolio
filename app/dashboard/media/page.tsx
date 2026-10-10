import { getServerAuthContext } from "@/app/modules/auth/getServer.context";
import { MediaView } from "./ui/media.view";

export const metadata = { title: "Galería | Dashboard" };

export default async function MediaPage() {
    const { userId } = await getServerAuthContext();
    return <MediaView userId={userId} />;
}
