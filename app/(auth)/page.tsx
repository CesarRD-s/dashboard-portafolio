import { redirect } from "next/navigation";
import { LoginView } from "./ui/login.view";
import { getCurrentUser } from "../modules/auth/getServer.context";

export const metadata = {
    title: 'Iniciar sesión'
}

export default async function LoginPage() {
    const { user } = await getCurrentUser();
    if (user) {
        redirect('/dashboard')
    }
    return <LoginView />
}
