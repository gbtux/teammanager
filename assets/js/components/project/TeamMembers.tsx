import { Member, ProjectPageProps } from '@/types/projects';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Mail, Phone, UserPlus, MoreVertical, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { UserAutocomplete } from '@/components/user-autocomplete';
import Routing from "@toyokumo/fos-router";
import routes from '@/fos_routes';
Routing.setRoutingData(routes)

export function TeamMembers({ project, members, all_users, all_roles }: ProjectPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: null as number | null,
        role_id: null as number | null,
    });

    const filteredMembers = members.filter(
        (projectMember) =>
            projectMember.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            projectMember.member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            projectMember.role.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(Routing.generate('project.members.store', {id: project.id}), {
            onSuccess: () => {
                setIsAddDialogOpen(false); // Ferme la modale
                reset(); // Réinitialise le formulaire
            },
        });
    };

    return (
        <div className="space-y-4">
            {/* Header with search and add button */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Team Member</DialogTitle>
                            <DialogDescription>Add a new member to this project team.</DialogDescription>
                        </DialogHeader>

                        {/* On lie le onSubmit ici */}
                        <form onSubmit={submit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>User</Label>
                                    <UserAutocomplete
                                        options={all_users}
                                        value={data.user_id}
                                        onChange={(id) => setData('user_id', id)}
                                        placeholder="Chercher un nom..."
                                    />
                                    {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={data.role_id?.toString()} onValueChange={(val) => setData('role_id', parseInt(val))}>
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {all_roles.map((role) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role_id && <p className="text-sm text-destructive">{errors.role_id}</p>}
                                </div>
                            </div>

                            <DialogFooter>
                                {/* Bouton de fermeture manuel */}
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                {/* Le bouton de soumission doit être type="submit" et ne pas fermer manuellement le dialogue */}
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Adding...' : 'Add Member'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Team stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{members.length}</div>
                        <p className="text-xs text-muted-foreground">Total Members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        {/* {teamMembers.filter((m) => m.status === 'active').length} */}
                        <div className="text-2xl font-bold">{members.length}</div>
                        <p className="text-xs text-muted-foreground">Active Members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        {/* TODO {teamMembers.reduce((sum, m) => sum + m.tasksAssigned, 0)} */}
                        <div className="text-2xl font-bold"></div>
                        <p className="text-xs text-muted-foreground">Total Tasks Assigned</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        {/* TODO {teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)} */}
                        <div className="text-2xl font-bold"></div>
                        <p className="text-xs text-muted-foreground">Tasks Completed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Team members grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((projectMember) => (
                    <Card key={projectMember.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>{getInitials(projectMember.member.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base">{projectMember.member.name}</CardTitle>
                                        <CardDescription className="text-sm">{projectMember.role.name}</CardDescription>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Remove from Project</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{projectMember.member.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span>member.phone</span>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                {/* TODO <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>{member.status}</Badge> */}
                                <Badge variant="default">Active</Badge>
                            </div>
                            <div className="border-t pt-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Tasks</span>
                                    <span className="font-medium">member.tasksCompleted / member.tasksAssigned</span>
                                </div>
                                <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                                    <div className="h-2 rounded-full bg-primary transition-all" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredMembers.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <p className="text-muted-foreground">No team members found</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
