import { Check, X, GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../types/planner';
import { usePlanner } from '../context/PlannerContext';

interface TaskBlockProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export function TaskBlock({ task, onEdit }: TaskBlockProps) {
  const { toggleTaskComplete, deleteTask } = usePlanner();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  });

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};
  
  const combinedStyle = {
    ...dragStyle,
    borderLeftColor: task.color,
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskComplete(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleClick = () => {
    if (onEdit && !isDragging) {
      onEdit(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      className={`
        group relative flex items-center gap-1.5 p-1.5 rounded-md mb-0.5
        border-l-4 cursor-pointer transition-all
        hover:shadow-md hover:scale-[1.01]
        ${isDragging ? 'opacity-50 z-50' : ''}
        ${task.completed ? 'opacity-60 bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-800'}
      `}
      onClick={handleClick}
    >
      <div
        {...listeners}
        {...attributes}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <GripVertical size={14} />
      </div>
      <button
        onClick={handleToggleComplete}
        className={`
          flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
          transition-colors
          ${task.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
          }
        `}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && <Check size={12} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div
          className={`
            text-sm font-medium truncate
            ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}
          `}
        >
          {task.title}
        </div>
        {task.description && (
          <div
            className={`
              text-xs truncate mt-0.5
              ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}
            `}
          >
            {task.description}
          </div>
        )}
        {task.category && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">
            {task.category}
          </span>
        )}
      </div>

      <button
        onClick={handleDelete}
        className="
          flex-shrink-0 opacity-0 group-hover:opacity-100
          p-1 rounded hover:bg-red-100 dark:hover:bg-red-900
          transition-opacity
        "
        aria-label="Delete task"
      >
        <X size={14} className="text-red-500" />
      </button>
    </div>
  );
}

