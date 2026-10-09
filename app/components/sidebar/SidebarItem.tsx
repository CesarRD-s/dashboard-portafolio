import clsx from "clsx"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

type Props = {
    icon: LucideIcon
    label: string
    active?: boolean
    collapsed: boolean
    href: string
    onClick: () => void
}

export function SidebarItem({
    icon: Icon,
    label,
    active,
    collapsed,
    href,
    onClick
}: Props) {
    return (
        <Link
            href={href}
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            aria-label={collapsed ? label : undefined}
            className={clsx(
                "flex items-center gap-3 w-full rounded-md px-3 py-2.5 text-sm transition-all cursor-pointer",
                active
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-600/70 dark:text-white"
                    : "text-neutral-600 hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-700"
            )}
        >
            <span className="flex h-5 w-5 items-center justify-center shrink-0">
                <Icon size={18} />
            </span>

            {/* Label */}
            <span className="whitespace-nowrap transition-all duration">
                {collapsed ? "" : label}
            </span>
        </Link>
    )
}
