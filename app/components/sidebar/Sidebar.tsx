'use client'

import { AppModules } from "@/app/lib/app_modules/appModules"
import { usePathname } from "next/navigation"
import { useSidebar } from "./sidebar.provider"
import { PanelLeft } from "lucide-react"
import { SidebarItem } from "./SidebarItem"
import clsx from "clsx"

export function Sidebar() {
    const pathname = usePathname() ?? ""

    const { isOpen, isCollapsed, isDesktop, toggleCollapse, close } = useSidebar()

    return (
        <>
            {/* Overlay mobile */}
            {!isDesktop && isOpen && (
                <div
                    onClick={close}
                    className="fixed inset-0 z-20 bg-neutral-600/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                />
            )}

            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-20 flex flex-col",
                    "bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-300 dark:border-neutral-700",
                    "transition-all duration ease-in-out",
                    isDesktop && (isCollapsed ? "w-[60px]" : "w-[260px]"),
                    !isDesktop && [
                        "w-[260px]",
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    ]
                )}
            >
                {/* Header */}
                <div className={clsx(
                    "flex items-center p-4",
                    isDesktop && isCollapsed ? "justify-center" : "justify-between")
                }>
                    {!isCollapsed && <span className="text-sm font-semibold">Menú</span>}

                    <button
                        onClick={() => isDesktop ? toggleCollapse() : close()}
                        className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                        <PanelLeft size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-2 space-y-1">
                    {AppModules.map(module => (
                        <SidebarItem
                            key={module.id}
                            icon={module.icon}
                            label={module.label}
                            active={pathname === module.basePath || (module.basePath !== '/dashboard' && pathname.startsWith(`${module.basePath}/`))}
                            collapsed={isCollapsed}
                            href={module.basePath}
                            onClick={() => { if (!isDesktop) close() }}
                        />
                    ))}
                </div>
            </aside>
        </>
    )
}
