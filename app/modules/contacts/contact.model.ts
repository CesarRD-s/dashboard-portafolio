export interface Contact {
    id: string;
    title: string;
    value: string;
    category: string;
    type: string;
    linkUrl: string;
    isPrimary: boolean;
    createdAt: string;
}

export const typeContact = [
    { text: "--- Selecciona tipo ---", value: "" },
    { text: "Correo electrónico", value: "email" },
    { text: "Teléfono", value: "phone" },
    { text: "LinkedIn", value: "linkedin" },
    { text: "GitHub", value: "github" },
    { text: "Facebook", value: "facebook" },
]

export const categoryContact = [
    { text: "--- Selecciona categoría ---", value: "" },
    { text: "Contacto directo", value: "direct" },
    { text: "Red social", value: "social" },
    { text: "Otro", value: "other" }
]
