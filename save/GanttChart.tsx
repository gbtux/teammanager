import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {GanttChartProps, Milestone, Task} from "@/types/projects";

const GANTT_COLORS = [
    'bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-rose-600',
    'bg-amber-600', 'bg-violet-600', 'bg-cyan-600', 'bg-orange-600',
];

export default function GanttChart({ project, milestones }: GanttChartProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
    const today = new Date();

    const navigate = (direction: 'prev' | 'next') => {
        setCurrentDate((prev) => {
            const next = new Date(prev);
            if (viewMode === 'month') {
                next.setMonth(direction === 'prev' ? prev.getMonth() - 1 : prev.getMonth() + 1);
            } else {
                next.setFullYear(direction === 'prev' ? prev.getFullYear() - 1 : prev.getFullYear() + 1);
            }
            return next;
        });
    };

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const isTodayInView = viewMode === 'month'
        ? currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
        : currentDate.getFullYear() === today.getFullYear();

    const getTaskPosition = (startDate: string, endDate: string): React.CSSProperties => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const year = currentDate.getFullYear();

        if (viewMode === 'month') {
            const viewStart = new Date(year, currentDate.getMonth(), 1);
            const viewEnd = new Date(year, currentDate.getMonth() + 1, 0);
            if (end < viewStart || start > viewEnd) return { display: 'none' };

            const days = getDaysInMonth(currentDate);
            const s = Math.max(start.getTime(), viewStart.getTime());
            const e = Math.min(end.getTime(), viewEnd.getTime());

            const startDay = new Date(s).getDate();
            const endDay = new Date(e).getDate();

            return {
                left: `${((startDay - 1) / days) * 100}%`,
                width: `${((endDay - startDay + 1) / days) * 100}%`,
                display: 'flex'
            };
        } else {
            // VUE YEAR
            const viewStart = new Date(year, 0, 1);
            const viewEnd = new Date(year, 11, 31);

            if (end < viewStart || start > viewEnd) return { display: 'none' };

            // Calcul du jour de l'année (1 à 365)
            const getDayOfYear = (date: Date) => {
                const firstDay = new Date(date.getFullYear(), 0, 0);
                const diff = date.getTime() - firstDay.getTime();
                return Math.floor(diff / (1000 * 60 * 60 * 24));
            };

            const totalDaysInYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;

            const s = start < viewStart ? 1 : getDayOfYear(start);
            const e = end > viewEnd ? totalDaysInYear : getDayOfYear(end);

            return {
                left: `${((s - 1) / totalDaysInYear) * 100}%`,
                width: `${Math.max(((e - s + 1) / totalDaysInYear) * 100, 0.5)}%`, // 0.5% min pour rester visible
                display: 'flex'
            };
        }
    };

    const monthNames = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
    const getHash = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };
    const getTaskColor = (id: string) => GANTT_COLORS[getHash(id) % GANTT_COLORS.length];
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-card p-2 rounded-xl border shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="flex bg-muted/50 p-1 rounded-md border gap-1">
                        <Button variant={viewMode === 'month' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-xs" onClick={() => setViewMode('month')}>Month</Button>
                        <Button variant={viewMode === 'year' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-xs" onClick={() => setViewMode('year')}>Year</Button>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigate('prev')}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigate('next')}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
                <h3 className="text-sm font-bold uppercase">{viewMode === 'month' ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : currentDate.getFullYear()}</h3>
            </div>

            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                <div className="grid grid-cols-12 bg-muted/30 border-b text-[10px] font-bold uppercase text-muted-foreground">
                    <div className="col-span-3 p-3 border-r">Milestone / Task</div>
                    <div className="col-span-9 py-3 relative flex justify-between">
                        {viewMode === 'month'
                            ? Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => (
                                <span key={i} className={`w-full text-center ${isTodayInView && i+1 === today.getDate() ? 'text-red-500 font-bold' : ''}`}>{i + 1}</span>
                            ))
                            : monthNames.map((m, i) => (
                                <span key={m} className={`w-full text-center ${isTodayInView && i === today.getMonth() ? 'text-red-500 font-bold' : ''}`}>{m}</span>
                            ))
                        }
                    </div>
                </div>

                <div className="relative divide-y">
                    {isTodayInView && (
                        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none z-20">
                            <div className="col-span-3" />
                            <div className="col-span-9 relative px-3">
                                <div className="absolute top-0 bottom-0 w-px bg-red-500/50"
                                     style={{ left: viewMode === 'month'
                                             ? `${((today.getDate() - 0.5) / getDaysInMonth(currentDate)) * 100}%`
                                             : `${((today.getMonth() + (today.getDate() / 31)) / 12) * 100}%`
                                     } as React.CSSProperties} />
                            </div>
                        </div>
                    )}

                    {milestones.map((milestone: Milestone) => (
                        <React.Fragment key={milestone.id}>
                            <div key={milestone.id} className="grid grid-cols-12 group hover:bg-muted/40">
                                <div className="col-span-3 p-3 border-r">
                                    <p className="text-xs font-semibold truncate">{milestone.title}</p>
                                    <p className="text-[9px] text-muted-foreground">{milestone.progress}%</p>
                                </div>
                                <div className="col-span-9 p-3 relative flex items-center">
                                    <div className="w-full h-4 bg-muted/20 rounded-full relative">
                                        <div className={`absolute h-full rounded-full flex items-center justify-center ${getTaskColor(milestone.id)}`}
                                             style={getTaskPosition(milestone.startDate, milestone.endDate)}>
                                            <span className="text-[8px] font-black text-white px-2">{milestone.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {milestone.tasks.map((task: Task) => (
                                <div key={task.id} className="grid grid-cols-12 group/task hover:bg-muted/20 border-b border-dashed border-muted">
                                    <div className="col-span-3 p-2 pl-6 border-r flex flex-col justify-center">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${task.completed ? 'bg-green-500' : 'bg-amber-500'}`} />
                                            <p className="text-[11px] font-medium truncate text-muted-foreground">{task.title}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-9 p-3 relative flex items-center">
                                        {/* On réutilise la même logique de position pour la barre de la tâche */}
                                        <div
                                            className={`absolute h-1.5 rounded-full opacity-60 group-hover/task:opacity-100 transition-opacity ${task.completed ? 'bg-green-500' : 'bg-amber-500'}`}
                                            style={getTaskPosition(task.startDate, task.dueDate)} // Cast si task n'a pas exactement les mêmes champs
                                        />
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
