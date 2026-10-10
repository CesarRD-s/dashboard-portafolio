export const MAX_SKILL_LOGO_BYTES = 1024 * 1024;

const logoExtensions: Record<string, readonly string[]> = {
    'image/svg+xml': ['svg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'image/jpeg': ['jpg', 'jpeg'],
};

export function getSkillLogoExtension(file: File): string | null {
    const extensions = logoExtensions[file.type];
    if (!extensions) return null;

    const extension = file.name.toLowerCase().split('.').pop();
    if (!extension || !extensions.includes(extension)) return null;

    return extension === 'jpeg' ? 'jpg' : extension;
}
