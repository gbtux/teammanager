import { GanttChartProps, GanttTask, Project, ProjectPageProps } from '@/types/projects';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


export default function GanttChart({ project }: GanttChartProps ) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    //Fake : TODO
    const mockTasks: GanttTask[] = [];
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const getTaskPosition = (task: GanttTask) => {
        const startDate = new Date(task.start_date)
        const endDate = new Date(task.end_date)
        //const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        //const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

        const daysInMonth = getDaysInMonth(currentMonth)
        const startDay = Math.max(1, startDate.getDate())
        const endDay = Math.min(daysInMonth, endDate.getDate())

        const left = ((startDay - 1) / daysInMonth) * 100
        const width = ((endDay - startDay + 1) / daysInMonth) * 100

        return { left: `${left}%`, width: `${width}%` }
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth((prev) => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else {
                newMonth.setMonth(prev.getMonth() + 1);
            }
            return newMonth;
        });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-semibold">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Gantt Chart */}
            <div className="overflow-hidden rounded-lg border">
                {/* Timeline Header */}
                <div className="border-b bg-muted/50">
                    <div className="grid grid-cols-12 gap-0">
                        <div className="col-span-4 border-r p-3">
                            <span className="font-medium">Task</span>
                        </div>
                        <div className="col-span-8 p-3">
                            <div className="grid grid-cols-31 gap-0 text-xs">
                                {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => (
                                    <div key={i} className="p-1 text-center">
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks */}
                <div className="divide-y">
                    {mockTasks.map((task) => (
                        <div key={task.id} className="grid grid-cols-12 gap-0 hover:bg-muted/25">
                            <div className="col-span-4 space-y-1 border-r p-3">
                                <div className="font-medium">{task.name}</div>
                                <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                        {task.assignee}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{task.progress}%</span>
                                </div>
                            </div>
                            <div className="relative col-span-8 p-3">
                                <div className="relative h-6">
                                    <div
                                        className={`absolute h-4 rounded ${task.color} flex items-center justify-center opacity-80`}
                                        style={getTaskPosition(task)}
                                    >
                                        <div className="text-xs font-medium text-white">{task.progress}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
