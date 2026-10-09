import { Section } from '@/app/components/layout/Section';
import { ButtonLink } from '@/app/components/shared/ButtonLink';
import { StatusMessage } from '@/app/components/ui/StatusMessage';
import type { Skill } from '@/app/modules/skills/skills.model';
import { Plus } from 'lucide-react';
import { SkillCard } from './components/SkillCard';

export function SkillView({ skills }: { skills: Skill[] }) {
    return <Section id="skills" title="Habilidades" description="Organiza las habilidades que muestras en tu portafolio.">
        <div className="flex justify-end">
            <ButtonLink href="/dashboard/skill/new" icon={Plus} label="Nueva habilidad" />
        </div>
        {skills.length === 0 ? (
            <StatusMessage title="Aún no hay habilidades" message="Agrega la primera para mostrarla en tu portafolio." />
        ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {skills.map(skill => <SkillCard key={skill.id} skill={skill} />)}
            </div>
        )}
    </Section>;
}
