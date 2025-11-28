import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import type { Task } from '../types/planner';
import { usePlanner } from '../context/PlannerContext';
import { DayColumn } from './DayColumn';
import { TaskBlock } from './TaskBlock';

export function WeekView() {
  const { tasks, moveTask, selectedDates } = usePlanner();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const task = tasks.find(t => t.id === active.id);
    if (!task) return;

    // Extract day, date, and timeSlot from the droppable ID
    // Format: "drop-{day}|{timestamp}|{timeSlot}"
    const dropId = over.id as string;
    if (typeof dropId === 'string' && dropId.startsWith('drop-')) {
      // Remove "drop-" prefix
      const rest = dropId.substring(5);
      // Split by "|" separator
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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full mx-auto px-24">
        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {selectedDates.map((date) => (
            <div key={date.getTime()} className="flex-shrink-0 w-[300px] mr-2">
              <DayColumn date={date} />
            </div>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90">
            <TaskBlock task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

