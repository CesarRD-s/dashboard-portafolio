'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { MoreHorizontal } from "lucide-react"

const routeMap: Record<string, string> = {
    dashboard: "Dashboard",
    profile: "Perfil",
    edit: "Editar",
    project: "Proyectos",
    new: "Nuevo",
    contact: "Contactos",
    skill: "Habilidades",
    configuration: "Configuración",
}

const isUUID = (str: string) => /^[0-9a-fA-F-]{36}$/.test(str)

const isDynamicSegment = (str: string) => {
    return isUUID(str) || /^[0-9a-fA-F]{24}$/.test(str)
}

function resolveLabel(segment: string) {
    if (routeMap[segment]) return routeMap[segment]

    if (isDynamicSegment(segment)) {
        return "Detalles"
    }

    return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export function Breadcrumbs({ hasProfile }: { hasProfile: boolean }) {
    const pathname = usePathname() ?? ""
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const segments = pathname.split("/").filter(Boolean)

    const paths = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const label = pathname === "/dashboard/profile/edit" && segment === "edit" && !hasProfile
            ? "Crear"
            : resolveLabel(segment)
        return { href, label }
    })

    const visiblePaths = paths.slice(-2)
    const hiddenPaths = paths.slice(0, -2)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <nav className="flex items-center gap-2 text-sm">
            {/*  Ellipsis */}
            {hiddenPaths.length > 0 && (
                <div className="relative md:hidden" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(prev => !prev)}
                        className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {open && (
                        <div className="absolute top-10 left-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md 
                        rounded-md p-2 flex flex-col gap-1 z-50 min-w-[160px]">
                            {hiddenPaths.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="px-2 py-1 rounded text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
                                    onClick={() => setOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-2">
                {paths.map((item, index) => {
                    const isLast = index === paths.length - 1

                    return (
                        <div key={item.href} className="flex items-center gap-2">
                            {!isLast ? (
                                <Link
                                    href={item.href}
                                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-neutral-900 dark:text-white">
                                    {item.label}
                                </span>
                            )}

                            {!isLast && (
                                <span className="text-neutral-400">/</span>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
                {visiblePaths.map((item, index) => {
                    const isLast = index === visiblePaths.length - 1

                    return (
                        <div key={item.href} className="flex items-center gap-2">
                            {!isLast ? (
                                <Link
                                    href={item.href}
                                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-neutral-900 dark:text-white">
                                    {item.label}
                                </span>
                            )}

                            {!isLast && (
                                <span className="text-neutral-400">/</span>
                            )}
                        </div>
                    )
                })}
            </div>
        </nav>
    )
}
