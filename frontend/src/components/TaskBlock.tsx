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
        group relative flex items-center gap-2.5 p-3 rounded-xl mb-1.5
        border-l-[4px] cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 z-50 scale-95 rotate-1' : 'transition-opacity duration-150'}
        ${task.completed 
          ? 'opacity-75 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm' 
          : 'border-gray-200/80 dark:border-gray-700/80 shadow-md shadow-black/5 dark:shadow-black/20 ring-1 ring-gray-200/50 dark:ring-gray-700/30'
        }
      `}
      onClick={(e) => {
        // Only edit if not dragging
        if (!isDragging && onEdit) {
          handleClick();
        }
      }}
    >
      <div className="flex-shrink-0 text-gray-300/60 dark:text-gray-600/60 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors">
        <GripVertical size={12} />
      </div>
      <button
        onClick={handleToggleComplete}
        className={`
          flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center
          transition-all duration-300 hover:scale-110 active:scale-95
          ${task.completed
            ? 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 border-green-500 text-white shadow-md shadow-green-500/30 ring-2 ring-green-500/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 dark:hover:from-green-900/30 dark:hover:to-green-800/20 hover:ring-2 hover:ring-green-400/20'
          }
        `}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && <Check size={11} strokeWidth={3} className="drop-shadow-sm" />}
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
          p-1.5 rounded-lg hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/20
          transition-all duration-300 hover:scale-110 active:scale-95
          hover:shadow-sm hover:shadow-red-500/20
        "
        aria-label="Delete task"
      >
        <X size={14} className="text-red-500 dark:text-red-400" />
      </button>
    </div>
  );
}

