"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

type Status = "To Do" | "Doing" | "Half done" | "Done";

interface Task {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  deadline: string;
  deadlineTime: string;
  status: Status;
  completed: boolean;
  createdAt: number;
}

interface Member {
  id: string;
  initials: string;
  name: string;
  color: string;
}

const COLUMNS: Status[] = ["To Do", "Doing", "Half done", "Done"];

const COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", 
  "bg-rose-500", "bg-indigo-500", "bg-orange-500", "bg-teal-500"
];

export default function TasksPage() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isAdding, setIsAdding] = useState<Status | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [memberInitials, setMemberInitials] = useState("");
  const [memberName, setMemberName] = useState("");
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
      } else {
        const seedTasks: Task[] = [
          { id: '1', title: "Ai chat now update content based on structure but we need to update it based on user requirement", priority: "High", deadline: "2026-04-25", deadlineTime: "10:00", status: "To Do", completed: false, createdAt: Date.now() },
          { id: '2', title: "session expired error", priority: "High", deadline: "2026-04-22", deadlineTime: "09:00", status: "To Do", completed: false, createdAt: Date.now() },
          { id: '4', title: "Anyone can add different ppts", priority: "Medium", deadline: "2026-04-23", deadlineTime: "11:00", status: "Half done", completed: false, createdAt: Date.now() },
        ];
        setTasks(seedTasks);
      }

      const storedMembers = localStorage.getItem("members");
      if (storedMembers) {
        setMembers(JSON.parse(storedMembers));
      } else {
        const seedMembers: Member[] = [
          { id: '1', initials: "PK", name: "Pratiksha", color: "bg-black" },
          { id: '2', initials: "AP", name: "Agent P", color: "bg-zinc-700" },
          { id: '3', initials: "AI", name: "AI Assistant", color: "bg-zinc-500" },
        ];
        setMembers(seedMembers);
        localStorage.setItem("members", JSON.stringify(seedMembers));
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (members.length > 0) localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

  const addTask = (status: Status) => {
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTitle,
      priority: "Medium",
      deadline: new Date().toISOString().split('T')[0],
      deadlineTime: "12:00",
      status: status,
      completed: status === "Done",
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
    setNewTitle("");
    setIsAdding(null);
  };

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberInitials.trim()) return;
    const newMember: Member = {
      id: crypto.randomUUID(),
      initials: memberInitials.toUpperCase().slice(0, 2),
      name: memberName || memberInitials,
      color: COLORS[members.length % COLORS.length]
    };
    setMembers([...members, newMember]);
    setMemberInitials("");
    setMemberName("");
    setIsAddingMember(false);
  };

  const moveTask = (id: string, newStatus: Status) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus, completed: newStatus === "Done" } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-x-auto relative">
        {/* Add Member Modal */}
        {isAddingMember && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
            <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl border border-zinc-100">
              <h3 className="text-xl font-black mb-6">Add Team Member</h3>
              <form onSubmit={addMember} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">Initials</label>
                  <input
                    autoFocus
                    required
                    maxLength={2}
                    value={memberInitials}
                    onChange={(e) => setMemberInitials(e.target.value)}
                    placeholder="e.g. JD"
                    className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm focus:border-black focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 ml-1">Full Name</label>
                  <input
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm focus:border-black focus:ring-0"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddingMember(false)} className="flex-1 py-4 text-sm font-bold text-zinc-400">Cancel</button>
                  <button type="submit" className="flex-1 rounded-2xl bg-black text-white font-black uppercase text-xs tracking-widest shadow-xl">Invite</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="p-8 h-full flex flex-col">
          <header className="mb-8 flex items-center justify-between flex-shrink-0">
             <div>
                <h2 className="text-3xl font-black tracking-tight text-zinc-900">Project Board</h2>
                <div className="mt-1 flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                   <p className="text-sm font-medium text-zinc-500">Live Workspace</p>
                </div>
             </div>
             
             {/* Dynamic Member List */}
             <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                  {members.map((member) => (
                    <div 
                      key={member.id} 
                      title={member.name}
                      className={`h-10 w-10 rounded-full ${member.color} border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden group`}
                    >
                      {member.initials}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsAddingMember(true)}
                    className="h-10 w-10 rounded-full bg-zinc-100 border-2 border-white flex items-center justify-center text-xs font-black text-zinc-400 hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    +
                  </button>
               </div>
               <div className="h-8 w-px bg-zinc-200 ml-2"></div>
               <button className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:bg-white transition-all">
                 Share
               </button>
             </div>
          </header>

          <div className="flex-1 flex gap-6 pb-4">
            {COLUMNS.map((col) => (
              <div key={col} className="w-80 flex-shrink-0 flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                   <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">{col}</h3>
                      <span className="text-[10px] font-bold bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-500">
                        {tasks.filter(t => t.status === col).length}
                      </span>
                   </div>
                   <button onClick={() => setIsAdding(col)} className="text-zinc-400 hover:text-black transition-colors">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                   </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                  {tasks.filter(t => t.status === col).map((task) => (
                    <div
                      key={task.id}
                      className="group relative rounded-2xl bg-white p-5 shadow-sm border border-zinc-100 hover:shadow-md hover:border-zinc-200 transition-all cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          task.priority === "High" ? "bg-red-50 text-red-500" :
                          task.priority === "Medium" ? "bg-amber-50 text-amber-500" :
                          "bg-blue-50 text-blue-500"
                        }`}>
                          {task.priority}
                        </span>
                        <button onClick={() => deleteTask(task.id)} className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                           <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <p className="text-sm font-bold text-zinc-800 leading-snug">{task.title}</p>
                      
                      <div className="mt-5 flex items-center justify-between">
                         <div className="flex -space-x-1.5">
                            {members.slice(0, 2).map((m, i) => (
                               <div key={i} className={`h-5 w-5 rounded-full ${m.color} border border-white flex items-center justify-center text-[6px] font-black text-white`}>
                                 {m.initials}
                               </div>
                            ))}
                         </div>
                         <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{task.deadlineTime}</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        {COLUMNS.filter(c => c !== task.status).map(c => (
                          <button
                            key={c}
                            onClick={() => moveTask(task.id, c)}
                            className="text-[8px] font-black uppercase tracking-tighter bg-zinc-50 py-1.5 rounded border border-zinc-100 hover:bg-black hover:text-white transition-all"
                          >
                            Move to {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {isAdding === col ? (
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xl">
                      <textarea
                        autoFocus
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-transparent text-sm border-none focus:ring-0 p-0 resize-none"
                        placeholder="What needs to be done?"
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            addTask(col);
                          }
                        }}
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button onClick={() => setIsAdding(null)} className="text-[10px] font-black uppercase text-zinc-400">Cancel</button>
                        <button onClick={() => addTask(col)} className="text-[10px] font-black uppercase text-white bg-black px-4 py-1.5 rounded-xl font-bold">Add Card</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAdding(col)}
                      className="w-full py-4 rounded-2xl border-2 border-dashed border-zinc-100 hover:border-zinc-300 transition-all text-sm font-bold text-zinc-300 hover:text-zinc-500 flex items-center justify-center gap-2 group"
                    >
                      <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add card
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
