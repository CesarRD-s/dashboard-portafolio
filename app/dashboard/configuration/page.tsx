import { getCurrentUser } from "@/app/modules/auth/getServer.context";
import { redirect } from "next/navigation";
import { ConfigurationView } from "./ui/configuration.view";

export default async function ConfigurationPage() {
    const { user } = await getCurrentUser();

    if (!user?.email) redirect("/");

    return <ConfigurationView email={user.email} phone={user.phone ?? null} />;
}
