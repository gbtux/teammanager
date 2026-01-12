import {Milestone, Task, WorkloadProps} from "@/types/projects";
import {
    GanttDependency,
    GanttFeature,
    GanttFeatureList, GanttFeatureListGroup, GanttFeatureRow,
    GanttHeader,
    GanttProvider,
    GanttSidebar,
    GanttSidebarGroup,
    GanttSidebarItem, GanttTimeline, GanttToday, GanttDependencyLayer, useSidebarColumns
} from "@/components/kibo-ui/gantt";
import {useEffect} from "react";

const getStyleFromSize = (size: number): string => {
    if (size <= 1) return 'bg-green-100 text-green-800 border-green-200'; // XS
    if (size <= 2) return 'bg-green-300 text-green-900 border-green-400'; // S
    if (size <= 5) return 'bg-green-500 text-white border-green-600';     // M
    if (size <= 10) return 'bg-green-700 text-white border-green-800';    // L
    return 'bg-green-900 text-white border-green-950';                  // XL
};

export default function Workload({project, milestones}: WorkloadProps) {
    const [, setColumns] = useSidebarColumns();
    useEffect(() => {
        /* 2. On force les colonnes au montage du composant.
           On utilise "as any" pour ne pas se battre avec le type TS complexe. */
        setColumns({
            name: true,
            status: true,
            start: true,
            end: true,
            successors: false,
            predecessors: false,
            deps: false, } as any);
    }, [setColumns]);
    const mapWorkloadsToFeatures = (tasks: Task[]): GanttFeature[] => {
        return tasks.flatMap((task) => {
            const workloads = task.workloads ?? [];
            return workloads.map((workload) => {
                const daysCount = parseFloat(workload.days) || 0;
                const displayDays = Number(daysCount);
                const sizeStyle = getStyleFromSize(daysCount);
                return {
                    id: `workload-${workload.id}`,
                    // On affiche le nombre de jours dans le label
                    name: `${task.title} (${displayDays} j) - ${task.assignee?.slice(0, 2)}`,
                    // La barre commence au début du mois
                    startAt: new Date(workload.year, workload.month - 1, 1),
                    // La barre finit à la fin du mois
                    endAt: new Date(workload.year, workload.month, 0),
                    // TRÈS IMPORTANT : Toutes les charges d'une même tâche sur la même ligne
                    lane: task.id,
                    status: {
                        id: "workload",
                        name: "Allocated",
                        color: daysCount > 5 ? "#ef4444" : "#3b82f6" // Rouge si surcharge (>5j/mois par ex)
                    },
                    className: `pl-1 shadow-sm font-medium ${sizeStyle}`,
                }
            });
        });
    };

    const handleAddWorkload = (date: Date) =>
        console.log(`Add workload: ${date.toISOString()}`);

    return (
        <GanttProvider
            className="border"
            onAddItem={handleAddWorkload}
            range="monthly"
            zoom={100}
        >
            <GanttSidebar >
                {milestones.map((milestone: Milestone) => (
                    <GanttSidebarGroup key={milestone.id} name={milestone.title}>
                        {milestone.tasks.map((task:Task) => (
                            <GanttSidebarItem
                                feature={{
                                    id: task.id,
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
                            />
                        ))}
                    </GanttSidebarGroup>
                ))}
            </GanttSidebar>
            <GanttTimeline>
                <GanttHeader />
                <GanttFeatureList>
                    {milestones.map((milestone: Milestone) => (
                        <GanttFeatureListGroup key={milestone.id}>
                            <div key={milestone.id}>
                                <GanttFeatureRow features={mapWorkloadsToFeatures(milestone.tasks)}/>
                            </div>
                        </GanttFeatureListGroup>
                    ))}
                </GanttFeatureList>
                <GanttToday />
            </GanttTimeline>
        </GanttProvider>
    )
}
