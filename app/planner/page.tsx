"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

interface Task {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  deadline: string;
  deadlineTime: string;
  completed: boolean;
}

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM

export default function PlannerPage() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    }
  }, [user, loading, router]);

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour} ${period}`;
  };

  const getTasksForSlot = (hour: number) => {
    return tasks.filter(task => {
      const taskDate = task.deadline;
      const taskHour = parseInt(task.deadlineTime.split(':')[0], 10);
      return taskDate === selectedDate && taskHour === hour;
    });
  };

  if (!user) return null;
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      <Sidebar />

      <main className="flex-1 px-8 py-12 overflow-y-auto">
        <header className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">Planner</h2>
            <p className="mt-2 text-lg text-zinc-600">Map out your day hour by hour.</p>
          </div>
          <div className="flex items-center gap-4 rounded-[2rem] bg-white p-2 shadow-sm border border-zinc-100">
             <button 
               onClick={() => {
                 const prev = new Date(selectedDate);
                 prev.setDate(prev.getDate() - 1);
                 setSelectedDate(prev.toISOString().split('T')[0]);
               }}
               className="p-3 text-zinc-400 hover:text-black transition-colors"
             >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             </button>
             <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-sm font-black uppercase tracking-widest focus:ring-0"
              />
              <button 
               onClick={() => {
                 const next = new Date(selectedDate);
                 next.setDate(next.getDate() + 1);
                 setSelectedDate(next.toISOString().split('T')[0]);
               }}
               className="p-3 text-zinc-400 hover:text-black transition-colors"
             >
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </button>
          </div>
        </header>

        <div className="rounded-[2.5rem] bg-white shadow-xl border border-zinc-100 overflow-hidden">
          <div className="divide-y divide-zinc-50">
            {TIME_SLOTS.map((hour) => {
              const slotTasks = getTasksForSlot(hour);
              const isCurrentHour = new Date().getHours() === hour && new Date().toISOString().split('T')[0] === selectedDate;

              return (
                <div key={hour} className={`flex min-h-[120px] group transition-all ${isCurrentHour ? "bg-zinc-50/50" : ""}`}>
                  <div className="w-32 flex-shrink-0 border-r border-zinc-50 p-6 flex flex-col items-end">
                    <span className={`text-sm font-black tracking-tighter ${isCurrentHour ? "text-black" : "text-zinc-300"}`}>
                      {formatHour(hour)}
                    </span>
                    {isCurrentHour && <div className="mt-2 h-1 w-1 rounded-full bg-black"></div>}
                  </div>
                  <div className="flex-1 p-4">
                    {slotTasks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {slotTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`rounded-[1.5rem] border p-5 shadow-sm transition-all hover:translate-y-[-2px] ${
                              task.completed 
                                ? "bg-zinc-50 opacity-60 border-zinc-100" 
                                : "bg-white border-zinc-100"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`text-sm font-black uppercase tracking-tight ${task.completed ? "text-zinc-400 line-through" : "text-zinc-900"}`}>
                                {task.title}
                              </h4>
                              <div className={`h-2 w-2 rounded-full ${
                                task.priority === "High" ? "bg-red-500" :
                                task.priority === "Medium" ? "bg-amber-500" :
                                "bg-blue-500"
                              }`}></div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{task.deadlineTime}</span>
                               <span className="text-[9px] font-black tracking-widest border border-zinc-100 px-2 py-0.5 rounded text-zinc-400">{task.priority}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full w-full rounded-2xl border border-transparent transition-all group-hover:bg-zinc-50/50"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
