import { User } from '@/types/index';

export interface Member {
    id: number;
    name: string;
    email?: string; // Optionnel si tu ne l'envoies pas toujours
}

interface Project {
    id: string;
    name: string;
    description: string;
    active: boolean;
    status: string;
    priority: string;
    progress: number;
    startDate: string;
    endDate: string;
}

interface ProjectsPageProps {
    projects: Project[];
    flash?: {
        success?: string;
        error?: string;
    };
}
interface Role {
    id: string;
    name: string;
}

interface ProjectMember {
    id: string;
    member: Member;
    project: Project;
    role: Role;
}
interface Milestone {
    id: string;
    title: string;
    description: string;
    active: boolean;
    status: string;
    startDate: string;
    endDate: string;
    progress: number;
    createdBy: User,
    tasks: Task[]
}
interface KanbanProps {
    kanban: Record<string, Task[]>;
}

interface ProjectPageProps {
    project: Project;
    members: ProjectMember[];
    milestones: Milestone[];
    all_roles: Role[];
    all_users: User[];
    kanban: KanbanProps,
    epics: Epic[]
}

interface TeamMembersProps {
    project: Project;
    members: ProjectMember[];
    all_roles: Role[];
    all_users: User[];
}

interface ProjectModalProps {
    showModal: boolean;
    modalType: 'create' | 'edit';
    project?: Project;
    onClose: () => void;
}

interface ProjectFormData {
    title: string;
    description: string;
    active: boolean;
    status: string;
    priority: string;
    progress: number;
    start_date: string;
    end_date: string;
}

interface ProjectConfirmProps {
    project: Project | null; // Remplace 'any' par ton interface Project
    onClose: () => void;
}

interface GanttTask {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    progress: number;
    assignee: string;
    dependencies?: string[];
    color: string;
}

interface GanttChartProps {
    project: Project;
    milestones: Milestone[];
}

interface Comment {
    id: string;
    content: string;
}
interface Tag {
    id: string;
    label: string;
}

interface Workload {
    id: string;
    month: number;
    year: number;
    days: string;
}

interface Task {
    id: string
    title: string
    description: string
    completed: boolean
    assignee: string
    startDate: string
    dueDate: string
    status: string;
    priority: "Low" | "Medium" | "High",
    comments: Comment[];
    tags: Tag[],
    workloads: Workload[]
}

interface KanbanPanelProps {
    kanban: KanbanProps;
    project: Project;
}

interface WorkloadProps {
    project: Project;
    milestones: Milestone[];
}

interface Story {
    id: string;
    title: string;
    acceptanceCriteria: string;
    description: string;
    status: string;
    priority: "Low" | "Medium" | "High";
    creator: User;
}
interface Epic {
    id: string;
    title: string;
    resume: string;
    description: string;
    status: string;
    priority: "Low" | "Medium" | "High";
    creator: User;
    creationDate: string;
    stories?: Story[];
}

interface EpicListProps {
    epics: Epic[];
}

export type { Project, ProjectsPageProps, ProjectModalProps,
    ProjectFormData, ProjectConfirmProps, ProjectPageProps, GanttTask, GanttChartProps, Milestone,
    Task, TeamMembersProps, KanbanPanelProps, WorkloadProps, EpicListProps, Epic, Story
};


