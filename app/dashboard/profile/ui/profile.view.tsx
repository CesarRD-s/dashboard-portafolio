import { Section } from "@/app/components/layout/Section";
import { ButtonLink } from "@/app/components/shared/ButtonLink";
import { Profile } from "@/app/modules/profile/profile.model";
import { formatDate } from "date-fns";
import { Edit, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
    profile: Profile | null
}

export function ProfileView({ profile }: Props) {
    if (!profile) {
        return (
            <Section id="profile" title="Perfil" description="Información pública mostrada en tu portafolio">
                <div className="rounded-md border border-neutral-300 dark:border-neutral-700 p-6 bg-white dark:bg-neutral-900/30 space-y-4">
                    <p className="text-neutral-600 dark:text-neutral-400">Todavía no has completado tu perfil.</p>
                    <ButtonLink href="/dashboard/profile/edit" icon={Edit} label="Crear perfil" />
                </div>
            </Section>
        );
    }

    return (
        <Section
            id="profile"
            title="Perfil"
            description="Información pública mostrada en tu portafolio"
        >

            <div className="flex justify-end">
                <ButtonLink
                    href="/dashboard/profile/edit"
                    icon={Edit}
                    label="Editar perfil"
                />
            </div>

            {/* MAIN CARD */}
            <div className="p-6 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/30 flex flex-col gap-6">

                <div className='flex flex-col md:flex-row items-center gap-6'>
                    {/* AVATAR */}
                    <div>
                        {profile.avatarUrl ? (
                            <Image
                                src={profile.avatarUrl}
                                alt="Avatar"
                                width={140}
                                height={140}
                                className="rounded-md border border-neutral-300 dark:border-neutral-700 object-cover shrink-0"
                            />
                        ) : (
                            <div className="flex h-[140px] w-[140px] items-center justify-center rounded-md border border-neutral-300 dark:border-neutral-700">
                                <UserRound aria-label="Sin avatar" size={48} className="text-neutral-500" />
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col gap-4 md:gap-1'>
                        {/* AUTHOR + YEAR */}
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                                {profile.author}
                            </h2>

                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium 
                            bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200">
                                Año {profile.year}
                            </span>
                        </div>
                        {/* SHORT BIO */}
                        <p className="text-base text-center md:text-start text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {profile.shortBio}
                        </p>
                    </div>
                </div>

                {/* TAG LINE */}
                <div className="p-5 rounded-md border border-neutral-200 dark:border-neutral-700
                        flex flex-col gap-2
                    ">
                    <span className="text-sm font-medium text-neutral-500">
                        Línea de etiqueta
                    </span>

                    <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {profile.tagLine}
                    </p>
                </div>

                {/* FOOTER */}
                <div className="
                        flex items-center justify-between flex-wrap gap-3
                        pt-4 border-t border-neutral-200 dark:border-neutral-800
                    ">
                    {profile.cvUrl && (
                        <Link
                            href={profile.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                            Descargar CV
                        </Link>
                    )}

                    <span className="text-sm text-neutral-500 whitespace-nowrap">
                        {formatDate(new Date(profile.updatedAt), "dd MMM yyyy")}
                    </span>
                </div>

            </div>
        </Section>
    )
}
