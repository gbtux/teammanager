import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'Completed':
            return 'default';
        case 'In Progress':
            return 'secondary';
        case 'Planning':
            return 'outline';
        case 'Review':
            return 'destructive';
        default:
            return 'outline';
    }
};

export const getTaskStatusColor = (status: string) => {
    switch (status) {
        case 'To Do':
            return 'bg-gray-500 text-white';
        case 'In Progress':
            return 'bg-blue-500 text-white';
        case 'Review':
            return 'bg-yellow-500 text-white';
        default:
            return 'bg-green-500 text-white';
    }
}

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'High':
            return 'destructive';
        case 'Medium':
            return 'default';
        case 'Low':
            return 'secondary';
        default:
            return 'outline';
    }
};
