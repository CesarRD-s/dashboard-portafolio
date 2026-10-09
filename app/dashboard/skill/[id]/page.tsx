import { SkillsService } from '@/app/modules/skills/skills.service';
import { SkillFormView } from '../ui/SkillForm.view';

export const metadata = { title: 'Editar habilidad | Habilidades' };

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const skill = await SkillsService.getOne(id);
    return <SkillFormView skill={skill} />;
}
