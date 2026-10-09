export const FILE_CONFIG = {
    avatar: {
        bucket: 'users',
        getPath: (userId: string) => `${userId}/avatars`,
        mime: ['image/jpeg', 'image/png'],
    },

    projectImage: {
        bucket: 'projects',
        getPath: (projectId: string) => `${projectId}/gallery`,
        mime: ['image/jpeg', 'image/png'],
    },

    cv: {
        bucket: 'users',
        getPath: (userId: string) => `${userId}/cv`,
        mime: ['application/pdf'],
    }
} as const;

export type FileType = keyof typeof FILE_CONFIG;

export const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf',
};
