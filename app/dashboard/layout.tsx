import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardShell } from "./ui/dashboard.layout";
import { ProfileService } from "../modules/profile/profile.service";
import { getCurrentUser } from "../modules/auth/getServer.context";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const { user } = await getCurrentUser();

    if (!user) { redirect("/") }
    const profile = await ProfileService.getOne();

    return (
        <DashboardShell profile={profile}>
            {children}
        </DashboardShell>
    )
}
