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
    createdBy: User
}
interface ProjectPageProps {
    project: Project;
    members: ProjectMember[];
    milestones: Milestone[];
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

export type { Project, ProjectsPageProps, ProjectModalProps,
    ProjectFormData, ProjectConfirmProps, ProjectPageProps, GanttTask, GanttChartProps, Milestone };


