import { SkillsService } from '@/app/modules/skills/skills.service';
import { SkillView } from './ui/skill.view';

export const metadata = { title: 'Habilidades | Dashboard' };

export default async function SkillPage() {
    const skills = await SkillsService.getAll();
    return <SkillView skills={skills} />;
}
