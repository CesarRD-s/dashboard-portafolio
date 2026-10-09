'use client';

import { Profile } from "@/app/modules/profile/profile.model";
import { Avatar } from "./Avatar";
import { LogOut, Menu } from "lucide-react";
import { useSidebar } from "@/app/components/sidebar/sidebar.provider";
import { Breadcrumbs } from "../../ui/Breadcrumbs";
import { AuthService } from "@/app/modules/auth/auth.service";
import { AppError } from "@/app/lib/errors/AppError";
import { useToast } from "@/app/components/toast/toast.provider";

type Props = {
    profile: Profile | null;
};

export function Header({ profile }: Props) {
    const { toggleOpen, isDesktop } = useSidebar();
    const { showToast } = useToast();

    const handlerLogOut = async () => {
        try {
            await AuthService.logout();
            window.location.replace("/");
        } catch (error) {
            showToast({
                title: "No se pudo cerrar sesión",
                message: error instanceof AppError ? error.message : "Inténtalo de nuevo.",
                type: "error",
            });
        }
    };

    return (
        <header className="sticky top-0 z-10 h-16 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 backdrop-blur-sm">
            <div className="flex h-full items-center justify-between px-4 md:px-6">

                {/* LEFT */}
                <div className="flex items-center gap-3">

                    {/* Mobile menu button */}
                    {!isDesktop && (
                        <button
                            onClick={toggleOpen}
                            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition cursor-pointer"
                        >
                            <Menu size={18} />
                        </button>
                    )}

                    <Breadcrumbs hasProfile={Boolean(profile)} />
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <Avatar profile={profile} />

                    {/* Logout */}
                    <button
                        onClick={handlerLogOut}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium tracking-relaxed text-neutral-700 dark:text-neutral-300 
                        hover:bg-neutral-200/50 dark:hover:bg-neutral-700 transition cursor-pointer"
                    >
                        <span className="hidden sm:inline-flex">Cerrar sesión</span>
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
