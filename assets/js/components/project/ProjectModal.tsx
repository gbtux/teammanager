import { ProjectModalProps } from '@/types/projects';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { router, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { formatLocalDate, parseLocalDate, safeFormat } from '@/hooks/use-localdate';
import { Calendar } from '@/components/ui/calendar';
import { useEffect } from 'react';
import Routing from "@toyokumo/fos-router";
import routes from '@/fos_routes';
Routing.setRoutingData(routes)

export default function ProjectModal({ showModal, modalType, project, onClose }: ProjectModalProps) {

    const { data, setData, post, put, processing, reset } = useForm({
        name: project?.name || '',
        description: project?.description || '',
        active: project?.active || true as boolean,
        priority: project?.priority || 'Low',
        status: project?.status || 'Planning',
        progress: project?.progress || 0,
        startDate: project?.startDate || '',
        endDate: project?.endDate || '',
    });

    useEffect(() => {
        if (project && modalType === 'edit') {
            setData({
                name: project.name,
                description: project.description,
                active: project.active,
                priority: project.priority,
                status: project.status,
                progress: project.progress,
                startDate: project.startDate,
                endDate: project.endDate,
            });
        } else if (modalType === 'create') {
            reset();
        }
    }, [project, modalType, showModal, setData, reset]);

    const handleClose = () => {
        if (modalType === 'create') {
            reset();
        }
        onClose();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (modalType === 'create') {
            post(Routing.generate('app_projects_store'), {
                onSuccess: () => {
                    handleClose();
                    router.reload();
                },
            });
        } else {
            put(Routing.generate('app_projects_update', {id: project?.id}), {
                preserveScroll: true,
                onSuccess: () => {
                    handleClose();
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Erreur lors de la modification:', errors);
                },
            });
        }
    };

    return (
        <Dialog open={showModal} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{modalType === 'create' ? 'Create Project' : 'Update project'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="title"
                            placeholder="Enter project name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your project..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Planning">Planning</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover modal={true}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn('w-full justify-start text-left font-normal', !data.startDate && 'text-muted-foreground')}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {safeFormat(data.startDate) ?? 'Pick a date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.startDate ? parseLocalDate(data.startDate) : undefined}
                                    onSelect={(value) => {
                                        if (value) {
                                            setData('startDate', formatLocalDate(value));
                                        } else {
                                            setData('startDate', '');
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover modal={true}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn('w-full justify-start text-left font-normal', !data.endDate && 'text-muted-foreground')}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {safeFormat(data.endDate) ?? 'Pick a date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.endDate ? parseLocalDate(data.endDate) : undefined}
                                    onSelect={(value) => {
                                        if (value) {
                                            setData('endDate', formatLocalDate(value));
                                        } else {
                                            setData('endDate', '');
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/*<div className="space-y-2">
                                    <Label>Assignee</Label>
                                    <Select
                                        value={data.assignee}
                                        onValueChange={(value) => setFormData({ ...formData, assignee: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select team member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="john">John Doe</SelectItem>
                                            <SelectItem value="jane">Jane Smith</SelectItem>
                                            <SelectItem value="mike">Mike Johnson</SelectItem>
                                            <SelectItem value="sarah">Sarah Wilson</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>*/}

                    <div className="flex space-x-2">
                        <Button type="submit" disabled={processing} className="flex-1">
                            {modalType === 'create' ? 'Create' : 'Update'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
