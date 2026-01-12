import {Epic, EpicListProps, Milestone, Story, Task} from "@/types/projects";
import {Button} from "@/components/ui/button";
import {Calendar, Plus} from "lucide-react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {getPriorityColor, getStatusColor, getTaskStatusColor} from "@/lib/utils";
import {Progress} from "@/components/ui/progress";

export default function EpicList({epics} : EpicListProps) {

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Epics</h3>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Epic
                </Button>
            </div>

            <Accordion type="multiple" className="space-y-4">
                {epics.map((epic: Epic) => (
                    <AccordionItem key={epic.id} value={epic.id} className="border rounded-lg">
                        <Card>
                            <AccordionTrigger className="hover:no-underline">
                                <CardHeader className="flex-1">
                                    <div className="flex items-start justify-between w-full">
                                        <div className="space-y-2 text-left">
                                            <CardTitle className="text-lg">{epic.title}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{epic.description}</p>
                                            <div className="flex items-center space-x-4 text-sm">
                                                <div className="flex items-center space-x-1">

                                                </div>
                                                <Badge variant={getStatusColor(epic.status)}>{epic.status}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-right space-y-2">
                                                <span>{epic.stories?.length} stories</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="pt-0">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Stories ({epic.stories?.length})</h4>
                                        </div>
                                        <div className="space-y-2">
                                            {epic.stories?.map((story: Story) => (
                                                <div
                                                    key={story.id}
                                                    className="flex items-center space-x-3 py-3 px-5 border rounded-lg hover:bg-muted/50"
                                                >
                                                    <div className="flex items-start justify-between w-full">
                                                        <div className="flex-1 space-y-1">
                                                            <div className="font-medium">
                                                                {story.title}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">{story.description}</div>
                                                            <div className="flex items-center space-x-2 text-xs">
                                                                <Badge variant={getPriorityColor(story.priority)} className="text-xs">
                                                                    {story.priority}
                                                                </Badge>
                                                                <span className="text-muted-foreground">Created: story.creationDate</span>
                                                                <span className="text-muted-foreground">Creator: {story.creator.name}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="secondary" className={getTaskStatusColor(story.status)}>{story.status}</Badge>
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
