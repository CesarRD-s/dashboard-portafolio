'use client'

import { Header } from "@/app/components/layout/header/Header"
import { Sidebar } from "@/app/components/sidebar/Sidebar"
import { SidebarProvider, useSidebar } from "@/app/components/sidebar/sidebar.provider"
import { ConfirmProvider } from "@/app/components/shared/modals/confirm.provider"
import { Profile } from "@/app/modules/profile/profile.model"
import { ReactNode } from "react"
import clsx from "clsx"

type Props = {
    children: ReactNode
    profile: Profile | null
}

function DashboardLayoutContent({ children, profile }: Props) {
    const { isCollapsed, isDesktop } = useSidebar()

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className={clsx(
                "flex flex-col w-full",
                "transition-all duration ease-in-out",
                isDesktop && !isCollapsed && "ml-[260px]",
                isDesktop && isCollapsed && "ml-[60px]")}
            >
                <Header profile={profile} />

                <main className={clsx(
                    "w-full px-6 py-8",
                    isDesktop && isCollapsed
                        ? "max-w-7xl mx-auto"
                        : "w-full"
                )}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export function DashboardShell(props: Props) {
    return (
        <SidebarProvider>
            <ConfirmProvider>
                <DashboardLayoutContent {...props} />
            </ConfirmProvider>
        </SidebarProvider>
    )
}
