"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
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

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed);
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = pendingTasks.filter(t => t.deadline === today);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Sidebar />

      <main className="flex-1 px-10 py-12 overflow-y-auto">
        <header className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">Dashboard</h2>
            <p className="mt-2 text-lg text-zinc-500 font-medium tracking-tight">Welcome back, {user.email?.split('@')[0]}. Here's your day at a glance.</p>
          </div>
          <div className="flex items-center gap-3">
             <Link href="/planner" className="group rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-bold shadow-sm transition-all hover:bg-zinc-50 active:scale-95 flex items-center gap-2">
               Scheduled View
               <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </Link>
             <Link href="/tasks" className="rounded-2xl bg-black px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-black/20 transition-all hover:bg-zinc-800 active:scale-95 flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
               Create Task
             </Link>
          </div>
        </header>

        {/* ... rest of the dashboard UI ... */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 mb-12">
          {/* Progress Card */}
          <div className="lg:col-span-3 rounded-[2.5rem] bg-white p-10 shadow-sm border border-zinc-100 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
               <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-1">Your Progress</h3>
              <p className="text-zinc-500 font-medium mb-8">You've completed <span className="text-black font-bold">{completedTasks} tasks</span> today. Keep it up!</p>
              
              <div className="flex items-end gap-12">
                <div className="flex-1">
                  <div className="relative h-6 w-full rounded-2xl bg-zinc-100 overflow-hidden p-1">
                    <div 
                      className="h-full bg-gradient-to-r from-zinc-800 to-black transition-all duration-1000 ease-in-out rounded-xl shadow-lg"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <span>Inception</span>
                    <span className="text-black text-xs">{Math.round(progress)}% Mastery</span>
                    <span>Zenith</span>
                  </div>
                </div>
                
                <div className="hidden md:flex gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-black">{totalTasks}</div>
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active</div>
                  </div>
                  <div className="h-10 w-px bg-zinc-100"></div>
                  <div className="text-center">
                    <div className="text-4xl font-black">{completedTasks}</div>
                    <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Done</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tip Card */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6">Wise Mindset</p>
             <h4 className="text-xl font-bold leading-tight mb-4">"The high road is always less crowded."</h4>
             <p className="text-sm opacity-60 leading-relaxed italic">Focus on the complex tasks first to unleash your potential.</p>
             <div className="mt-8 flex items-center gap-2">
                <div className="h-1 w-8 rounded-full bg-white/20"></div>
                <div className="h-1 w-2 rounded-full bg-white"></div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Today's Tasks View */}
          <div className="rounded-[2.5rem] bg-white p-10 shadow-sm border border-zinc-100 backdrop-blur-md">
            <div className="mb-10 flex items-center justify-between">
               <h3 className="text-2xl font-black tracking-tight">Today's Focus</h3>
               <Link href="/planner" className="h-10 w-10 rounded-full border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               </Link>
            </div>
            
            {todayTasks.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-3xl group cursor-pointer hover:bg-zinc-50/50 transition-colors" onClick={() => router.push('/tasks')}>
                 <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                 </div>
                 <p className="text-zinc-500 font-bold tracking-tight">No tasks set for today.</p>
                 <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-black">Click to create</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayTasks.map(task => (
                  <Link key={task.id} href="/tasks" className="flex items-center justify-between p-5 rounded-2xl bg-zinc-50/50 border border-transparent hover:border-zinc-200 hover:bg-white transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={`h-3 w-3 rounded-full ${task.priority === 'High' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 'bg-black'}`}></div>
                      <div>
                        <span className="text-base font-bold text-zinc-900 block">{task.title}</span>
                        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{task.priority} Priority</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-sm font-black text-zinc-900">{task.deadlineTime}</span>
                       <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-tighter">Deadline</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Section */}
          <div className="rounded-[2.5rem] bg-white p-10 shadow-sm border border-zinc-100 backdrop-blur-md">
             <div className="mb-10 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight">Timeline</h3>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Next 48 Hours</span>
             </div>
             
             <div className="space-y-8 relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-px bg-zinc-100"></div>
                {pendingTasks.slice(0, 4).length === 0 ? (
                   <p className="text-center py-12 text-zinc-400 font-medium italic">Your timeline is clear.</p>
                ) : (
                  pendingTasks.slice(0, 4).map((task, idx) => (
                    <div key={task.id} className="relative flex items-center gap-6 group cursor-pointer" onClick={() => router.push('/tasks')}>
                       <div className={`z-10 h-10 w-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-sm transition-all group-hover:scale-110 ${idx === 0 ? 'bg-black' : 'bg-zinc-100'}`}>
                          <span className={`text-[10px] font-black ${idx === 0 ? 'text-white' : 'text-zinc-500'}`}>
                            {task.deadlineTime.split(':')[0]}
                          </span>
                       </div>
                       <div className="flex-1 py-1">
                         <h4 className="text-base font-bold text-zinc-900 group-hover:translate-x-1 transition-transform">{task.title}</h4>
                         <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.1em] mt-1">{task.deadline} • {task.deadlineTime}</p>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
