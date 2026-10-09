export interface Profile {
    author: string;
    shortBio: string;
    tagLine: string;
    profession: string;
    year: number;
    avatarUrl: string;
    cvUrl: string;
    updatedAt: string;
}

export interface StatItem {
    title: string;
    description: string;
    count: number;
}

export interface RecentActivity {
    id: string;
    createdAt: string;
    title: string;
    type: 'project' | 'contact';
}

export interface OverviewData {
    stats: StatItem[];
    recentActivity: RecentActivity[];
}
