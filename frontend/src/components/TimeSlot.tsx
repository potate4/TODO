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
          border-b border-gray-200 dark:border-gray-700 min-h-[50px] p-1.5
          transition-colors group
          ${isOver ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
          ${visibleTasks.length === 0 ? 'cursor-pointer' : ''}
        `}
      >
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-14 text-xs text-gray-500 dark:text-gray-400 font-medium">
            {label}
          </div>
          
          <div className="flex-1 min-w-0">
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
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                    +{overflowCount} more task{overflowCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="
                  w-full opacity-0 group-hover:opacity-100
                  flex items-center justify-center gap-1
                  px-2 py-1 rounded text-xs text-gray-400 dark:text-gray-500
                  transition-all pointer-events-none
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

