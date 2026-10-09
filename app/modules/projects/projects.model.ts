export interface Project {
    id: string
    userId: string
    title: string
    description: string
    imgUrl: string
    stack: string[]
    role: string
    link: string
    createdAt: string
}

export const roleOptions = [
    { text: "--- Selecciona rol ---", value: "" },
    { text: "Frontend", value: "Desarrollador Frontend" },
    { text: "Backend", value: "Desarrollador Backend" },
    { text: "Fullstack", value: "Desarrollador Fullstack" },
];
