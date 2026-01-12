import {GanttChartProps, Milestone, Task} from "@/types/projects";
import {
    GanttDependency,
    GanttDependencyLayer,
    GanttFeature,
    GanttFeatureItem,
    GanttFeatureList, GanttFeatureListGroup,
    GanttHeader, GanttMarker,
    GanttProvider,
    GanttSidebar,
    GanttSidebarGroup,
    GanttSidebarItem,
    GanttTimeline, GanttToday
} from "@/components/kibo-ui/gantt";
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {EyeIcon, LinkIcon, TrashIcon} from "lucide-react";
import {useState} from "react";

const STATUS_COLORS: Record<string, string> = {
    "To Do": "#6B7280",
    "In Progress": "#F59E0B",
    "Done": "#10B981",
    "Review": "#8B5CF6"
};
const mapMilestonesToFeatures = (milestones: Milestone[]): GanttFeature[] => {
    return milestones.flatMap((milestone) => {
        return milestone.tasks.map((task) => ({
            id: "T" + task.id.toString(),
            name: task.title,
            startAt: new Date(task.startDate),
            endAt: new Date(task.dueDate),
            status: {
                id: `status-${task.status}`,
                name: task.status,
                color: task.completed ? "#10b981" : "#F59E0B"
            },
            // On injecte le nom de la milestone pour le groupBy de la sidebar
            group: {
                id: milestone.id,
                name: milestone.title
            }
        }));
    });
};

const exampleDependencies: GanttDependency[] = [
    // Finish-to-Start: Feature 0 must finish before Feature 1 can start
    {
        id: "dep-fs-1",
        sourceId: "T21",
        targetId: "T22",
        type: "FS",
        color: "#F59E0B",
    }
]

export default function Gantt ({ project, milestones }: GanttChartProps) {
    const [features, setFeatures] = useState<GanttFeature[]>(() =>
        mapMilestonesToFeatures(milestones)
    );
    const handleViewFeature = (id: string) =>
        console.log(`Feature selected: ${id}`);
    const handleCopyLink = (id: string) => console.log(`Copy link: ${id}`);
    const handleRemoveFeature = (id: string) =>
        setFeatures((prev) => prev.filter((feature) => feature.id !== id));
    const handleMoveFeature = (id: string, startAt: Date, endAt: Date | null) => {
        if (!endAt) {
            return;
        }
        setFeatures((prev) =>
            prev.map((feature) =>
                feature.id === id ? { ...feature, startAt, endAt } : feature
            )
        );
        console.log(`Move feature: ${id} from ${startAt} to ${endAt}`);
    };

    return (
        <GanttProvider className="border" range="monthly" zoom={100}>
            <GanttSidebar>
                {milestones.map((milestone: Milestone) => (
                    <GanttSidebarGroup key={milestone.id} name={milestone.title}>
                        {milestone.tasks.map((task:Task) => (
                            <GanttSidebarItem
                                feature={{
                                    id: "T"+ task.id.toString(),
                                    name: task.title,
                                    startAt: new Date(task.startDate),
                                    endAt: new Date(task.dueDate),
                                    status: {
                                        id: Math.random().toString(36).substring(2, 9),
                                        name: task.status,
                                        color: task.completed ? "#10b981" : "#F59E0B"
                                    }
                                }}
                                key={task.id}
                                dependencies={exampleDependencies}
                                allFeatures={features}
                            />
                        ))}
                    </GanttSidebarGroup>
                ))}
            </GanttSidebar>
            <GanttTimeline>
                <GanttHeader/>
                <GanttFeatureList>
                    {milestones.map((milestone: Milestone) => (
                        <GanttFeatureListGroup key={milestone.id}>
                            {milestone.tasks.map((task:Task) => (
                                <div className="flex" key={task.id}>
                                    <ContextMenu>
                                        <ContextMenuTrigger asChild>
                                            <button
                                                onClick={() => handleViewFeature(task.id)}
                                                type="button"
                                            >
                                                <GanttFeatureItem
                                                    onMove={handleMoveFeature}
                                                    {...{
                                                        id: "T" + task.id.toString(),
                                                        name: task.title,
                                                        startAt: new Date(task.startDate),
                                                        endAt: new Date(task.dueDate),
                                                        status: {
                                                            id: Math.random().toString(36).substring(2, 9),
                                                            name: task.status,
                                                            color: task.completed ? "#10b981" : "#F59E0B"
                                                        }
                                                    }}
                                                >
                                                    <p className="flex-1 truncate text-xs">
                                                        {task.title}
                                                    </p>
                                                    {task.assignee && (
                                                        <Avatar className="h-4 w-4">
                                                            <AvatarFallback>
                                                                {task.assignee?.slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                </GanttFeatureItem>
                                            </button>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem
                                                className="flex items-center gap-2"
                                                onClick={() => handleViewFeature(task.id)}
                                            >
                                                <EyeIcon className="text-muted-foreground" size={16}/>
                                                View task
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                className="flex items-center gap-2"
                                                onClick={() => handleCopyLink(task.id)}
                                            >
                                                <LinkIcon className="text-muted-foreground" size={16}/>
                                                Copy link
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                className="flex items-center gap-2 text-destructive"
                                                onClick={() => handleRemoveFeature(task.id)}
                                            >
                                                <TrashIcon size={16}/>
                                                Remove from roadmap
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                </div>
                            ))}
                        </GanttFeatureListGroup>
                    ))}
                </GanttFeatureList>
                {milestones.map((milestone) => (
                    <GanttMarker
                        key={milestone.id}
                        {...{
                            id: milestone.id,
                            date: new Date(milestone.startDate),
                            label: milestone.title,
                            className: 'bg-blue-100 text-blue-900'
                        }}
                    />
                ))}

                <GanttDependencyLayer dependencies={exampleDependencies} />
                <GanttToday/>
            </GanttTimeline>
        </GanttProvider>
    );
}
