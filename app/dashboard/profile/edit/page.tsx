import { ProfileService } from "@/app/modules/profile/profile.service";
import { ProfileEditView } from "./ui/profileEdit.view";

export const metadata = {
    title: 'Perfil | Dashboard'
}

export default async function ProfileEditPage() {
    const data = await ProfileService.getOne()
    return <ProfileEditView profile={data} />
}
