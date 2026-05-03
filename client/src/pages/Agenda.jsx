import React, { useState, useEffect, useMemo } from 'react';
import useTaskStore from '../store/useTaskStore';
import { Plus, Trash2, Calendar as CalendarIcon, Check, Circle, GripVertical } from 'lucide-react';
import { format, isToday, isPast, addDays, isSameDay, startOfWeek, parseISO } from 'date-fns';
import confetti from 'canvas-confetti';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PRIORITY_COLORS = {
  High: 'bg-rose-500',
  Medium: 'bg-amber-500',
  Low: 'bg-emerald-500'
};

const DUE_COLORS = (date) => {
  if (!date) return 'text-gray-500 bg-gray-500/10';
  if (isPast(new Date(date)) && !isToday(new Date(date))) return 'text-rose-500 bg-rose-500/10';
  if (isToday(new Date(date))) return 'text-amber-500 bg-amber-500/10';
  return 'text-emerald-500 bg-emerald-500/10';
};

const SortableTaskItem = ({ task, onToggle, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group relative flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all ${task.isCompleted ? 'opacity-50' : ''}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-gray-300 hover:text-gray-500">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <button 
        onClick={() => onToggle(task._id, !task.isCompleted)}
        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.isCompleted ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {task.isCompleted && <Check className="w-4 h-4 text-white animate-[scale-in_0.2s_ease-out]" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold text-gray-800 truncate transition-all ${task.isCompleted ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </p>
        {task.dueDate && (
          <p className={`text-xs mt-0.5 inline-block px-1.5 py-0.5 rounded font-medium ${DUE_COLORS(task.dueDate)}`}>
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </p>
        )}
      </div>

      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority || 'Medium']}`} title={`${task.priority} Priority`} />

      <button 
        onClick={() => onDelete(task._id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-rose-500 transition-all absolute right-2 bg-white rounded-lg"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function Agenda() {
  const { tasks, isLoading, fetchTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [localTasks, setLocalTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLocalTasks((items) => {
        const oldIndex = items.findIndex(i => i._id === active.id);
        const newIndex = items.findIndex(i => i._id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        // Note: For full persistence, we'd PUT a new order array to the backend here
        return reordered;
      });
    }
  };

  const handleToggle = async (id, isCompleted) => {
    // Optimistic update
    setLocalTasks(prev => prev.map(t => t._id === id ? { ...t, isCompleted } : t));
    await updateTask(id, { isCompleted });
    
    // Check confetti condition: if we just checked something, and all non-empty today tasks are done
    if (isCompleted) {
      const todayTasks = localTasks.filter(t => !t.dueDate || isToday(new Date(t.dueDate)));
      const activeToday = todayTasks.filter(t => !t.isCompleted && t._id !== id);
      if (todayTasks.length > 0 && activeToday.length === 0) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'] });
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      title: newTaskTitle.trim(),
      dueDate: selectedDate,
      priority: 'Medium',
      isCompleted: false
    };
    
    await addTask(newTask);
    setNewTaskTitle('');
  };

  // Weekly Calendar Generation
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  // Filter tasks based on selected day and completion
  const displayedTasks = localTasks.filter(t => {
    if (!t.dueDate) return isSameDay(selectedDate, new Date());
    return isSameDay(new Date(t.dueDate), selectedDate);
  });

  const activeTasks = displayedTasks.filter(t => !t.isCompleted);
  const completedTasks = displayedTasks.filter(t => t.isCompleted);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-up">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              {format(selectedDate, 'MMMM d, yyyy')} · {activeTasks.length} tasks left
            </p>
          </div>
        </div>

        {/* Weekly Mini-Calendar */}
        <div className="flex justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar gap-2">
          {weekDays.map(day => {
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);
            const dayTasks = localTasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day) && !t.isCompleted);
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center min-w-[3rem] p-2 rounded-xl transition-all ${
                  isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <span className={`text-xs font-bold uppercase ${isSelected ? 'text-indigo-200' : ''}`}>
                  {format(day, 'EEE')}
                </span>
                <span className={`text-lg font-black mt-1 ${isTodayDate && !isSelected ? 'text-indigo-600' : ''}`}>
                  {format(day, 'd')}
                </span>
                <div className="flex gap-0.5 mt-2 h-1.5">
                  {dayTasks.slice(0, 3).map((t, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : PRIORITY_COLORS[t.priority || 'Medium']}`} />
                  ))}
                  {dayTasks.length > 3 && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/50' : 'bg-gray-300'}`} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Add Bar */}
        <form onSubmit={handleAdd} className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Plus className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Add a new task... (press Enter)"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full bg-white border-2 border-transparent focus:border-indigo-500 shadow-sm rounded-2xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400 outline-none transition-all font-medium text-lg"
          />
        </form>

        {/* Task Lists */}
        {isLoading && localTasks.length === 0 ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Active Tasks */}
            {activeTasks.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={activeTasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {activeTasks.map(task => (
                      <SortableTaskItem 
                        key={task._id} 
                        task={task} 
                        onToggle={handleToggle}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">You're all caught up! 🎉</h3>
                <p className="text-gray-500">No active tasks for this day. Enjoy your free time or add a new task above.</p>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Completed ({completedTasks.length})
                </h3>
                <div className="space-y-2 opacity-60">
                  {completedTasks.map(task => (
                    <div key={task._id} className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-100/50 rounded-xl">
                      <button 
                        onClick={() => handleToggle(task._id, false)}
                        className="shrink-0 w-6 h-6 rounded-full border-2 bg-gray-300 border-gray-300 flex items-center justify-center transition-colors"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </button>
                      <p className="flex-1 min-w-0 text-sm font-semibold text-gray-500 line-through truncate">
                        {task.title}
                      </p>
                      <button 
                        onClick={() => deleteTask(task._id)}
                        className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
}

// Icon mapping (duplicate to avoid adding to lucide imports)
const CheckCircle2 = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
