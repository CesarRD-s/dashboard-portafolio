import { Section } from '@/app/components/layout/Section';
import { ButtonLink } from '@/app/components/shared/ButtonLink';
import { StatusMessage } from '@/app/components/ui/StatusMessage';
import type { Project } from '@/app/modules/projects/projects.model';
import { Plus } from 'lucide-react';
import { ProjectCard } from './components/ProjectCard';

export function ProjectView({ projects }: { projects: Project[] }) {
    return <Section id="projects" title="Mis Proyectos" description="Gestiona tus proyectos">
        <div className="flex justify-end">
            <ButtonLink href="/dashboard/project/new" icon={Plus} label="Nuevo proyecto" />
        </div>
        {projects.length === 0 ? (
            <StatusMessage title="No hay proyectos disponibles" message="Agrega un proyecto para mostrarlo en tu portafolio." />
        ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(project => <ProjectCard key={project.id} project={project} />)}
            </div>
        )}
    </Section>;
}
