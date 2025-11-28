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
          border-b border-gray-100 dark:border-gray-800/50 h-[60px] px-3 py-2.5
          transition-all duration-150 group overflow-hidden
          ${isOver ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50' : 'hover:bg-gray-50/60 dark:hover:bg-gray-800/30'}
          ${visibleTasks.length === 0 ? 'cursor-pointer' : ''}
        `}
      >
        <div className="flex items-start gap-3 h-full">
          <div className="flex-shrink-0 w-16 text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wide pt-0.5">
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
                  px-3 py-2 rounded-lg text-xs font-medium text-gray-400 dark:text-gray-500
                  transition-all duration-200 pointer-events-none
                  bg-gray-50/50 dark:bg-gray-800/30
                "
              >
                <Plus size={14} />
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

