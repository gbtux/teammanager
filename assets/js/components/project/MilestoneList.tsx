import {GanttChartProps, Milestone, Task} from "@/types/projects";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {Button} from "@/components/ui/button";
import {Calendar, Plus} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {getPriorityColor, getStatusColor, getTaskStatusColor} from "@/lib/utils";
import {Progress} from "@/components/ui/progress";

export default function MilestoneList({ project, milestones }: GanttChartProps) {
    console.log("MilestoneList", milestones);
    const toggleTaskCompletion = (operationId: string, taskId: string) => {

    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Operations</h3>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Operation
                </Button>
            </div>

            <Accordion type="multiple" className="space-y-4">
                {milestones.map((milestone: Milestone) => (
                    <AccordionItem key={milestone.id} value={milestone.id} className="border rounded-lg">
                        <Card>
                            <AccordionTrigger className="hover:no-underline">
                                <CardHeader className="flex-1">
                                    <div className="flex items-start justify-between w-full">
                                        <div className="space-y-2 text-left">
                                            <CardTitle className="text-lg">{milestone.title}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{milestone.startDate} - {milestone.endDate}</span>
                                                </div>
                                                <Badge variant={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-right space-y-2">
                                                <div className="text-sm font-medium">{milestone.progress}%</div>
                                                <Progress value={milestone.progress} className="w-20 mb-1" />
                                                <span>{milestone.tasks.length} tasks</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="pt-0">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Tasks ({milestone.tasks.length})</h4>
                                        </div>
                                        <div className="space-y-2">
                                            {milestone.tasks.map((task: Task) => (
                                                <div
                                                    key={task.id}
                                                    className="flex items-center space-x-3 py-3 px-5 border rounded-lg hover:bg-muted/50"
                                                >
                                                    <div className="flex items-start justify-between w-full">
                                                        <div className="flex-1 space-y-1">
                                                            <div
                                                                className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                                                            >
                                                                {task.title}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">{task.description}</div>
                                                            <div className="flex items-center space-x-2 text-xs">
                                                                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                                                    {task.priority}
                                                                </Badge>
                                                                <span className="text-muted-foreground">Due: {task.dueDate}</span>
                                                                <span className="text-muted-foreground">Assigned to: {task.assignee}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="secondary" className={getTaskStatusColor(task.status)}>{task.status}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
