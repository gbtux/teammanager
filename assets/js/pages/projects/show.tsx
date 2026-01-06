import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ProjectPageProps } from '@/types/projects';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import GanttChart from '@/components/project/GanttChart';
import { TeamMembers } from '@/components/project/TeamMembers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/',
    },
    {
        title: 'Projects',
        href: '/projects',
    },
    {
        title: 'Project details',
        href: '',
    }
];

export default function ProjectPage({ project, members, milestones, all_users, all_roles }: ProjectPageProps ) {
    const [activeTab, setActiveTab] = useState('planning');
    console.log(members, milestones)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={project.name} />
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                {/* Header */}
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                        <a href="/projects">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Projects
                        </a>
                    </Button>
                </div>
                {/* Project Info */}
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                            <p className="text-muted-foreground">{project.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{project.status}</Badge>
                            <Badge variant="destructive">{project.priority}</Badge>
                        </div>
                    </div>
                    {/* Project Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardContent className="flex items-center p-4">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Duration</p>
                                    <p className="text-xs text-muted-foreground">
                                        {project.startDate} - {project.endDate}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex items-center p-4">
                                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Team Size</p>
                                    <p className="text-xs text-muted-foreground">{members.length} members</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex items-center p-4">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Progress</p>
                                    <p className="text-xs text-muted-foreground">{project.progress}% complete</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex items-center p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Budget</p>
                                    <p className="text-xs text-muted-foreground">"project.budget"</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="planning">Planning</TabsTrigger>
                        <TabsTrigger value="workload">Workload</TabsTrigger>
                        <TabsTrigger value="operations">Milestones</TabsTrigger>
                        <TabsTrigger value="kanban">Kanban</TabsTrigger>
                        <TabsTrigger value="files">Files</TabsTrigger>
                        <TabsTrigger value="team">Team</TabsTrigger>
                    </TabsList>
                    <TabsContent value="planning" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Timeline</CardTitle>
                                <CardDescription>Gantt chart view of project tasks and milestones</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <GanttChart project={project} milestones={milestones} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="team" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Members</CardTitle>
                                <CardDescription>Manage project team members and assignments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TeamMembers project={project} members={members} all_users={all_users} all_roles={all_roles} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
