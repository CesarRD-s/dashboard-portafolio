import {
    FolderPlus,
    MailPlus,
    Pencil,
    LucideIcon,
    Mail,
    Folder,
    Wrench,
} from "lucide-react";

type Action = {
    label: string;
    description: string;
    href: string;
    icon: LucideIcon;
};

export const actions: Action[] = [
    {
        label: "Nuevo contacto",
        description: "Agregar un nuevo medio de contacto",
        href: "/dashboard/contact/new",
        icon: MailPlus,
    },

    {
        label: "Nuevo proyecto",
        description: "Publicar un nuevo proyecto",
        href: "/dashboard/project/new",
        icon: FolderPlus,
    },

    {
        label: "Nueva habilidad",
        description: "Agregar una habilidad al portafolio",
        href: "/dashboard/skill/new",
        icon: Wrench,
    },

    {
        label: "Perfil",
        description: "Completar o actualizar información personal",
        href: "/dashboard/profile/edit",
        icon: Pencil,
    },
];

type ActivityConfig = {
    label: string;
    icon: LucideIcon;
};

export const activityConfig: Record<string, ActivityConfig> = {
    contact: {
        label: "Nuevo contacto",
        icon: Mail,
    },

    project: {
        label: "Proyecto agregado",
        icon: Folder,
    },

    skill: {
        label: "Nueva habilidad",
        icon: Wrench,
    },
};
