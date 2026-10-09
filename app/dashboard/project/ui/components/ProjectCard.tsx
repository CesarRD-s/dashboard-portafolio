import { Project } from "@/app/modules/projects/projects.model"
import { formatDate } from "date-fns"
import { Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DeleteProjectButton } from "./DeleteProjectButton"

type Props = {
    project: Project
}

export function ProjectCard({ project }: Props) {
    return (
        <div
            className="p-5 rounded-md border border-neutral-300 dark:border-neutral-700 
            bg-white dark:bg-neutral-900/30 flex flex-col justify-between gap-4"
        >
            {/* TOP */}
            <div className="flex flex-col gap-3">

                {/* IMAGE */}
                {project.imgUrl && (
                    <div className="w-full h-36 overflow-hidden rounded-md">
                        <Image
                            src={project.imgUrl}
                            alt={project.title}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* TITLE */}
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white line-clamp-2">
                    {project.title}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                    {project.description}
                </p>

                {/* STACK */}
                <div className="flex flex-wrap gap-2">
                    {project.stack?.map((stack, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full 
                            bg-neutral-100 dark:bg-neutral-700/50 
                            text-neutral-600 dark:text-neutral-300"
                        >
                            {stack}
                        </span>
                    ))}
                </div>

                {/* ROLE */}
                {project.role && (
                    <span className="text-xs text-neutral-500">
                        {project.role}
                    </span>
                )}
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-300 dark:border-neutral-700">
                <span className="text-xs text-neutral-500">
                    {formatDate(new Date(project.createdAt), "dd MMM yyyy")}
                </span>

                <div className="flex items-center gap-4">
                    <Link
                        href={`/dashboard/project/${project.id}`}
                        className="text-sm font-medium text-blue-500/80 hover:underline"
                    >
                        <Edit size={14} className="inline-block mr-1" />
                        Editar
                    </Link>

                    <DeleteProjectButton id={project.id} title={project.title} />
                </div>
            </div>
        </div>
    )
}
