import type { Skill } from '@/app/modules/skills/skills.model';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DeleteSkillButton } from './DeleteSkillButton';

export function SkillCard({ skill }: { skill: Skill }) {
    return <article className="flex min-h-44 flex-col justify-between gap-5 rounded-md border border-neutral-300 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900/30">
        <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800">
                {skill.logoUrl && <Image src={skill.logoUrl} alt="" width={40} height={40} unoptimized={/\.svg(?:\?|$)/i.test(skill.logoUrl)} className="max-h-full w-auto object-contain" />}
            </div>
            <div className="min-w-0 space-y-1">
                <h2 className="truncate font-semibold text-neutral-900 dark:text-white">{skill.title}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{skill.category}</p>
                {skill.isPrimary && <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">Destacada</span>}
            </div>
        </div>
        <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-3 dark:border-neutral-700">
            <Link href={`/dashboard/skill/${skill.id}`} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                <Edit size={14} className="mr-1 inline-block" />Editar
            </Link>
            <DeleteSkillButton id={skill.id} title={skill.title} />
        </div>
    </article>;
}
