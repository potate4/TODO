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
  
  // Convert hex to rgba with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  const combinedStyle = {
    ...dragStyle,
    borderLeftColor: task.color,
    backgroundColor: hexToRgba(task.color, 0.1),
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
      {...listeners}
      {...attributes}
      style={combinedStyle}
      className={`
        group relative flex items-center gap-2.5 p-2.5 rounded-lg mb-1.5
        border-l-[3px] cursor-grab active:cursor-grabbing transition-all duration-200
        hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20
        hover:-translate-y-0.5
        ${isDragging ? 'opacity-50 z-50 scale-95' : ''}
        ${task.completed 
          ? 'opacity-70 border-gray-200 dark:border-gray-700' 
          : 'border-gray-200 dark:border-gray-700 shadow-sm'
        }
      `}
      onClick={(e) => {
        // Only edit if not dragging
        if (!isDragging && onEdit) {
          handleClick();
        }
      }}
    >
      <div className="flex-shrink-0 text-gray-300 dark:text-gray-600">
        <GripVertical size={12} />
      </div>
      <button
        onClick={handleToggleComplete}
        className={`
          flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center
          transition-all duration-200
          ${task.completed
            ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-500 text-white shadow-sm'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
          }
        `}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && <Check size={11} strokeWidth={3} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div
          className={`
            text-sm font-semibold truncate leading-tight
            ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}
          `}
        >
          {task.title}
        </div>
        {task.description && (
          <div
            className={`
              text-xs truncate mt-1 leading-relaxed
              ${task.completed ? 'line-through text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}
            `}
          >
            {task.description}
          </div>
        )}
        {task.category && (
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-1.5 inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700/50 rounded">
            {task.category}
          </span>
        )}
      </div>

      <button
        onClick={handleDelete}
        className="
          flex-shrink-0 opacity-0 group-hover:opacity-100
          p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30
          transition-all duration-200
        "
        aria-label="Delete task"
      >
        <X size={14} className="text-red-500 dark:text-red-400" />
      </button>
    </div>
  );
}

