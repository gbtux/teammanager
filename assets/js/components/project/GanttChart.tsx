import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {GanttChartProps, Milestone} from "@/types/projects";

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

    const getTaskPosition = (task: Milestone): React.CSSProperties => {
        const start = new Date(task.startDate);
        const end = new Date(task.endDate);

        if (viewMode === 'month') {
            const viewStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const viewEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            if (end < viewStart || start > viewEnd) return { display: 'none' };

            const days = getDaysInMonth(currentDate);
            const s = start < viewStart ? 1 : start.getDate();
            const e = end > viewEnd ? days : end.getDate();
            return {
                left: `${((s - 1) / days) * 100}%`,
                width: `${((e - s + 1) / days) * 100}%`,
                display: 'flex'
            };
        } else {
            if (start.getFullYear() > currentDate.getFullYear() || end.getFullYear() < currentDate.getFullYear()) return { display: 'none' };
            const sMonth = start.getFullYear() < currentDate.getFullYear() ? 0 : start.getMonth();
            const eMonth = end.getFullYear() > currentDate.getFullYear() ? 11 : end.getMonth();
            return {
                left: `${(sMonth / 12) * 100}%`,
                width: `${((eMonth - sMonth + 1) / 12) * 100}%`,
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
                    <div className="col-span-3 p-3 border-r">Tâche</div>
                    <div className="col-span-9 p-3 relative flex justify-between">
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

                    {milestones.map((milestone) => (
                        <div key={milestone.id} className="grid grid-cols-12 group hover:bg-muted/40">
                            <div className="col-span-3 p-3 border-r">
                                <p className="text-xs font-semibold truncate">{milestone.title}</p>
                                <p className="text-[9px] text-muted-foreground">{milestone.progress}%</p>
                            </div>
                            <div className="col-span-9 p-3 relative flex items-center">
                                <div className="w-full h-4 bg-muted/20 rounded-full relative">
                                    <div className={`absolute h-full rounded-full flex items-center justify-center ${getTaskColor(milestone.id)}`}
                                         style={getTaskPosition(milestone)}>
                                        <span className="text-[8px] font-black text-white px-2">{milestone.progress}%</span>
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
