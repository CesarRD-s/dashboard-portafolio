export interface Project {
    id: string
    userId: string
    title: string
    description: string
    imgUrl: string
    stack: string[]
    role: string
    repo: string | null
    demo: string | null
    createdAt: string
}
