import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Header } from './components/Header';
import { WeekView } from './components/WeekView';
import { PredefinedTasksPanel } from './components/PredefinedTasksPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { Task, PredefinedTask } from './types/planner';
import { TaskBlock } from './components/TaskBlock';

function AppContent() {
  const { tasks, moveTask, createTaskFromPredefined, addTask, predefinedTasks } = usePlanner();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activePredefinedTask, setActivePredefinedTask] = useState<PredefinedTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    } else if (typeof active.id === 'string' && active.id.startsWith('predefined-')) {
      const predefinedId = active.id.replace('predefined-', '');
      const predefinedTask = predefinedTasks.find(t => t.id === predefinedId);
      if (predefinedTask) {
        setActivePredefinedTask(predefinedTask);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setActivePredefinedTask(null);

    if (!over) return;

    // Check if it's a predefined task being dropped
    if (typeof active.id === 'string' && active.id.startsWith('predefined-')) {
      const predefinedId = active.id.replace('predefined-', '');
      const predefinedTask = predefinedTasks.find(t => t.id === predefinedId);
      
      if (predefinedTask) {
        // Extract day, date, and timeSlot from the droppable ID
        const dropId = over.id as string;
        if (typeof dropId === 'string' && dropId.startsWith('drop-')) {
          const rest = dropId.substring(5);
          const parts = rest.split('|');
          if (parts.length === 3) {
            const day = parts[0];
            const timestamp = parseInt(parts[1], 10);
            const timeSlot = parts[2];
            if (day && timeSlot && !isNaN(timestamp)) {
              const newDate = new Date(timestamp);
              const newTask = createTaskFromPredefined(predefinedTask, day as any, newDate, timeSlot);
              addTask(newTask);
            }
          }
        }
      }
      return;
    }

    // Regular task drag
    const task = tasks.find(t => t.id === active.id);
    if (!task) return;

    // Extract day, date, and timeSlot from the droppable ID
    const dropId = over.id as string;
    if (typeof dropId === 'string' && dropId.startsWith('drop-')) {
      const rest = dropId.substring(5);
      const parts = rest.split('|');
      if (parts.length === 3) {
        const day = parts[0];
        const timestamp = parseInt(parts[1], 10);
        const timeSlot = parts[2];
        if (day && timeSlot && !isNaN(timestamp)) {
          const newDate = new Date(timestamp);
          moveTask(task.id, day as any, newDate, timeSlot);
        }
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <Header />
        <PredefinedTasksPanel />
        <div className="w-full py-6">
          <WeekView />
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90">
            <TaskBlock task={activeTask} />
          </div>
        ) : activePredefinedTask ? (
          <div className="opacity-90 p-2.5 rounded-lg border-l-[3px] bg-white dark:bg-gray-800 shadow-lg" style={{ borderLeftColor: activePredefinedTask.color, backgroundColor: `rgba(${parseInt(activePredefinedTask.color.slice(1, 3), 16)}, ${parseInt(activePredefinedTask.color.slice(3, 5), 16)}, ${parseInt(activePredefinedTask.color.slice(5, 7), 16)}, 0.1)` }}>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{activePredefinedTask.title}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <PlannerProvider>
        <AppContent />
      </PlannerProvider>
    </ErrorBoundary>
  );
}

export default App;

