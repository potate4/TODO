import { useState } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import type { PredefinedTask } from '../types/planner';
import { DEFAULT_TASK_COLORS } from '../types/planner';
import { usePlanner } from '../context/PlannerContext';
import { ColorPicker } from './ColorPicker';

interface PredefinedTaskItemProps {
  task: PredefinedTask;
  onEdit: (task: PredefinedTask) => void;
  onDelete: (id: string) => void;
}

function PredefinedTaskItem({ task, onEdit, onDelete }: PredefinedTaskItemProps) {
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `predefined-${task.id}`,
    data: { predefinedTask: task },
  });

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};

  const combinedStyle = {
    ...dragStyle,
    borderLeftColor: task.color,
    backgroundColor: hexToRgba(task.color, 0.1),
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={combinedStyle}
      className={`
        group relative flex items-center gap-2 p-2.5 rounded-lg mb-1.5
        border-l-[3px] cursor-grab active:cursor-grabbing transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${isDragging ? 'opacity-50 z-50 scale-95' : ''}
        border-gray-200 dark:border-gray-700 shadow-sm
      `}
      onClick={(e) => {
        // Only edit if not dragging
        if (!isDragging) {
          onEdit(task);
        }
      }}
    >
      <div className="flex-shrink-0 text-gray-300 dark:text-gray-600">
        <GripVertical size={12} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">
          {task.title}
        </div>
        {task.description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-relaxed">
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
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="
          flex-shrink-0 opacity-0 group-hover:opacity-100
          p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30
          transition-all duration-200
        "
        aria-label="Delete predefined task"
      >
        <X size={14} className="text-red-500 dark:text-red-400" />
      </button>
    </div>
  );
}

interface PredefinedTaskFormProps {
  task?: PredefinedTask | null;
  onClose: () => void;
}

function PredefinedTaskForm({ task, onClose }: PredefinedTaskFormProps) {
  const { addPredefinedTask, updatePredefinedTask, createPredefinedTask } = usePlanner();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [color, setColor] = useState(task?.color || DEFAULT_TASK_COLORS[4]);
  const [category, setCategory] = useState(task?.category || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (task) {
      updatePredefinedTask(task.id, { title, description, color, category });
    } else {
      const newTask = createPredefinedTask(title, color, description, category);
      addPredefinedTask(newTask);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {task ? 'Edit' : 'Add'} Predefined Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Task title"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Task description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Category"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <ColorPicker selectedColor={color} onColorChange={setColor} />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {task ? 'Update' : 'Add'} Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PredefinedTasksPanel() {
  const { predefinedTasks, deletePredefinedTask } = usePlanner();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<PredefinedTask | null>(null);

  const handleAddClick = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleTaskEdit = (task: PredefinedTask) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Predefined Tasks</h2>
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {predefinedTasks.length > 0 ? (
            predefinedTasks.map((task) => (
              <PredefinedTaskItem
                key={task.id}
                task={task}
                onEdit={handleTaskEdit}
                onDelete={deletePredefinedTask}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No predefined tasks. Add one to get started!</p>
          )}
        </div>
      </div>

      {isFormOpen && (
        <PredefinedTaskForm task={editingTask} onClose={handleFormClose} />
      )}
    </>
  );
}

