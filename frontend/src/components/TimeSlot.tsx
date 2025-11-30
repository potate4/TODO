import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import type { DayOfWeek, Task } from '../types/planner';
import { usePlanner } from '../context/PlannerContext';
import { TaskBlock } from './TaskBlock';
import { TaskForm } from './TaskForm';

interface TimeSlotProps {
  day: DayOfWeek;
  date: Date;
  timeSlot: string;
  label: string;
}

const MAX_VISIBLE_TASKS = 3;

export function TimeSlot({ day, date, timeSlot, label }: TimeSlotProps) {
  const { getTasksForTimeSlot } = usePlanner();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${day}|${date.getTime()}|${timeSlot}`,
  });

  const tasks = getTasksForTimeSlot(day, date, timeSlot);
  const visibleTasks = tasks.slice(0, MAX_VISIBLE_TASKS);
  const overflowCount = tasks.length - MAX_VISIBLE_TASKS;

  const handleAddClick = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        onClick={visibleTasks.length === 0 ? handleAddClick : undefined}
        className={`
          border-b border-gray-200/60 dark:border-gray-700/60 h-[72px] px-3 py-2.5
          transition-all duration-300 group overflow-hidden
          ${isOver ? 'bg-gradient-to-r from-blue-50/90 via-blue-100/50 to-transparent dark:from-blue-900/30 dark:via-blue-800/20 dark:to-transparent border-blue-400/50 dark:border-blue-500/50 shadow-inner' : 'hover:bg-gradient-to-r hover:from-gray-50/80 hover:via-gray-100/40 hover:to-transparent dark:hover:from-gray-800/40 dark:hover:via-gray-700/20 dark:hover:to-transparent'}
          ${visibleTasks.length === 0 ? 'cursor-pointer' : ''}
        `}
      >
        <div className="flex items-start gap-3 h-full">
          <div className="flex-shrink-0 w-16 text-xs text-gray-500 dark:text-gray-400 font-bold tracking-wider pt-0.5 uppercase">
            {label}
          </div>
          
          <div className="flex-1 min-w-0 h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {visibleTasks.length > 0 ? (
              <div className="space-y-1">
                {visibleTasks.map((task) => (
                  <TaskBlock
                    key={task.id}
                    task={task}
                    onEdit={handleTaskEdit}
                  />
                ))}
                {overflowCount > 0 && (
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    +{overflowCount} more task{overflowCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="
                  w-full h-full opacity-0 group-hover:opacity-100
                  flex items-center justify-center gap-1.5
                  px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400
                  transition-all duration-300 pointer-events-none
                  bg-gradient-to-br from-gray-100/60 to-gray-50/40 dark:from-gray-800/40 dark:to-gray-700/20
                  border border-dashed border-gray-300/50 dark:border-gray-600/50
                "
              >
                <Plus size={14} className="text-gray-400 dark:text-gray-500" />
                <span>Click to add task</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          day={day}
          date={date}
          timeSlot={timeSlot}
          onClose={handleFormClose}
        />
      )}
    </>
  );
}

