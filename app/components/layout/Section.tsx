import { ReactNode } from "react"

type Props = {
    id?: string
    title?: string
    description?: string
    className?: string
    children: ReactNode
}

export function Section({ id = "", title, description, className = "", children }: Props) {
    return (
        <section id={id} className={`space-y-6 scroll-mt-32 ${className}`}>
            {(title || description) && (
                <div>
                    {title && (
                        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            {title}
                        </h1>
                    )}
                    {description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            {description}
                        </p>
                    )}
                </div>
            )}

            {children}
        </section>
    )
}
