import {KanbanPanelProps, Task} from "@/types/projects";
import {Button} from "@/components/ui/button";
import {Calendar, MessageSquare, MoreHorizontal, Paperclip, Plus} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {getPriorityColor} from "@/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {useEffect, useState} from "react";
import { router } from '@inertiajs/react';
import Routing from "@toyokumo/fos-router";
import routes from '@/fos_routes';
Routing.setRoutingData(routes)

export default function Kanban({project, kanban} : KanbanPanelProps) {
    const [data, setData] = useState(kanban);
    const columns = Object.entries(kanban);

    // Synchronise l'état local quand les props changent (après le flush Symfony)
    useEffect(() => {
        setData(kanban);
    }, [kanban]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        // Si on lâche hors d'une zone ou au même endroit : on ne fait rien
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        // 1. Préparation de la mise à jour locale (Optimistic UI)
        // @ts-ignore
        const sourceCol = [...data[source.droppableId]];
        // @ts-ignore
        const destCol = [...data[destination.droppableId]];
        const [movedTask] = sourceCol.splice(source.index, 1);

        // Si déplacement dans la même colonne
        if (source.droppableId === destination.droppableId) {
            sourceCol.splice(destination.index, 0, movedTask);
            setData({ ...data, [source.droppableId]: sourceCol });
        }
        // Si changement de colonne (changement de statut)
        else {
            destCol.splice(destination.index, 0, movedTask);
            setData({ ...data, [source.droppableId]: sourceCol, [destination.droppableId]: destCol });

            // 2. Appel au backend Symfony pour mettre à jour le statut
            router.patch(Routing.generate('app_tasks_update_status', { id: draggableId }), {
                status: destination.droppableId // Le droppableId correspond au nom de la colonne
            }, {
                preserveScroll: true,
                onError: () => setData(kanban) // On annule si le serveur refuse
            });
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Kanban Board</h3>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {columns.map(([status, tasks]) => (
                        <div key={status} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" />
                                    <h4 className="font-medium">{status}</h4>
                                    <Badge variant="secondary" className="text-xs">
                                        {tasks.length}
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Droppable droppableId={status}>
                                {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 h-[calc(100vh-200px)]">
                                    {tasks.map((task: Task, index: number) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                                        <CardContent className="px-4 space-y-3">
                                                            <div className="flex items-start justify-between">
                                                                <h5 className="font-medium text-sm">{task.title}</h5>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm">
                                                                            <MoreHorizontal className="h-3 w-3" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>

                                                            <p className="text-xs text-muted-foreground">{task.description}</p>

                                                            <div className="flex flex-wrap gap-1">
                                                                {task.tags?.map((tag) => (
                                                                    <Badge key={tag.id} variant="outline" className="text-xs">
                                                                        {tag.label}
                                                                    </Badge>
                                                                ))}
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-2">
                                                                    <Avatar className="h-6 w-6">
                                                                        <AvatarFallback className="text-xs bg-blue-500 text-white">{getInitials(task.assignee)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                                                        {task.priority}
                                                                    </Badge>
                                                                </div>

                                                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                                    <div className="flex items-center space-x-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        <span>{task.dueDate}</span>
                                                                    </div>
                                                                    {task.comments.length > 0 && (
                                                                        <div className="flex items-center space-x-1">
                                                                            <MessageSquare className="h-3 w-3" />
                                                                            <span>{task.comments.length}</span>
                                                                        </div>
                                                                    )}
                                                                    {/*{task.attachments > 0 && (
                                                                        <div className="flex items-center space-x-1">
                                                                            <Paperclip className="h-3 w-3" />
                                                                            <span>{task.attachments}</span>
                                                                        </div>
                                                                    )}*/}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}
