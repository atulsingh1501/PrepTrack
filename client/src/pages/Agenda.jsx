import React, { useEffect, useState } from 'react';
import useTaskStore from '../store/useTaskStore';
import { CalendarDays, Plus, CheckCircle2, Circle, Trash2, Clock, AlertCircle } from 'lucide-react';

const Agenda = () => {
  const { tasks, isLoading, fetchTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'Medium' });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    await addTask(newTask);
    setNewTask({ title: '', dueDate: '', priority: 'Medium' });
    setShowForm(false);
  };

  const toggleComplete = (task) => {
    updateTask(task._id, { isCompleted: !task.isCompleted });
  };

  const activeTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 backdrop-blur-md bg-dark-800/40 p-6 rounded-2xl border border-white/5 shadow-glass">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <CalendarDays className="text-purple-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Daily Agenda</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your placement preparation tasks</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-white font-medium hover:opacity-90 shadow-lg shadow-primary-500/20 transition-all"
          >
            <Plus className="w-5 h-5" /> New Task
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddTask} className="mb-8 p-6 bg-dark-800/60 backdrop-blur-md border border-white/10 rounded-2xl animate-fade-in shadow-xl relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               <div className="md:col-span-3">
                 <label className="block text-sm text-gray-400 mb-1">Task Title</label>
                 <input 
                   type="text" 
                   required
                   value={newTask.title} 
                   onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none text-white transition-all"
                   placeholder="e.g., Revise DP algorithms, Give Mock Interview"
                 />
               </div>
               <div>
                 <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                 <input 
                   type="date" 
                   value={newTask.dueDate} 
                   onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none text-white invert-[0.8] mix-blend-lighten"
                 />
               </div>
               <div>
                 <label className="block text-sm text-gray-400 mb-1">Priority</label>
                 <select 
                   value={newTask.priority} 
                   onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:ring-2 focus:ring-primary-500 outline-none text-white appearance-none"
                 >
                   <option value="Low">Low</option>
                   <option value="Medium">Medium</option>
                   <option value="High">High</option>
                 </select>
               </div>
             </div>
             <div className="flex justify-end gap-3">
               <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
               <button type="submit" className="px-6 py-2 rounded-lg bg-white text-dark-900 font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/20">Save Task</button>
             </div>
          </form>
        )}

        {isLoading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="space-y-8">
            {/* Active Tasks */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary-400" /> 
                Pending Tasks ({activeTasks.length})
              </h2>
              {activeTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-dark-800/20 border border-white/5 rounded-2xl border-dashed">
                  No active tasks! You are all caught up.
                </div>
              ) : (
                <div className="space-y-3 relative z-0">
                  {activeTasks.map(task => (
                    <div key={task._id} className="flex items-center justify-between p-4 bg-dark-800/40 hover:bg-dark-800 border border-white/5 hover:border-white/10 rounded-xl transition-all shadow-sm group">
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleComplete(task)}>
                        <button className="text-gray-400 hover:text-primary-400 transition-colors">
                          <Circle className="w-6 h-6" />
                        </button>
                        <div>
                          <p className="text-white font-medium text-lg">{task.title}</p>
                          {task.dueDate && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs px-3 py-1 rounded-full border ${getPriorityColor(task.priority)} font-medium hidden sm:inline-block`}>
                          {task.priority}
                        </span>
                        <button onClick={() => deleteTask(task._id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gray-500" /> 
                  Completed ({completedTasks.length})
                </h2>
                <div className="space-y-3 opacity-60">
                  {completedTasks.map(task => (
                    <div key={task._id} className="flex items-center justify-between p-4 bg-dark-900 border border-white/5 rounded-xl">
                      <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleComplete(task)}>
                        <button className="text-primary-500">
                          <CheckCircle2 className="w-6 h-6" />
                        </button>
                        <p className="text-gray-400 line-through text-lg">{task.title}</p>
                      </div>
                      <button onClick={() => deleteTask(task._id)} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agenda;
