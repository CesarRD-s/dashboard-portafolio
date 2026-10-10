import { User, Folder, Mail, Wrench, LucideIcon, Settings, HomeIcon, Images } from "lucide-react";

export type AppModule = {
    id: string;
    label: string;
    icon: LucideIcon;
    basePath: string;
};

export const AppModules: AppModule[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: HomeIcon,
        basePath: "/dashboard"
    },
    {
        id: "profile",
        label: "Perfil",
        icon: User,
        basePath: "/dashboard/profile"
    },
    {
        id: "projects",
        label: "Proyectos",
        icon: Folder,
        basePath: "/dashboard/project",
    },
    {
        id: "media",
        label: "Galería",
        icon: Images,
        basePath: "/dashboard/media",
    },
    {
        id: "contacts",
        label: "Contactos",
        icon: Mail,
        basePath: "/dashboard/contact",
    },
    {
        id: "skills",
        label: "Habilidades",
        icon: Wrench,
        basePath: "/dashboard/skill"
    }, {
        id: "configuration",
        label: "Configuración",
        icon: Settings,
        basePath: "/dashboard/configuration"
    }
];
