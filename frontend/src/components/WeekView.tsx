import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { DAYS_OF_WEEK } from '../types/planner';
import type { Task } from '../types/planner';
import { usePlanner } from '../context/PlannerContext';
import { DayColumn } from './DayColumn';
import { TaskBlock } from './TaskBlock';

export function WeekView() {
  const { tasks, moveTask } = usePlanner();
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

    // Extract day and timeSlot from the droppable ID
    // Format: "drop-{day}-{timeSlot}" where timeSlot is like "06:00"
    const dropId = over.id as string;
    if (typeof dropId === 'string' && dropId.startsWith('drop-')) {
      // Remove "drop-" prefix
      const rest = dropId.substring(5);
      // Find the first occurrence of "-" to separate day from timeSlot
      const firstDashIndex = rest.indexOf('-');
      if (firstDashIndex > 0) {
        const day = rest.substring(0, firstDashIndex);
        const timeSlot = rest.substring(firstDashIndex + 1);
        if (day && timeSlot) {
          moveTask(task.id, day as any, timeSlot);
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
      <div className="flex overflow-x-auto px-4">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="flex-shrink-0 w-[280px]">
            <DayColumn day={day} />
          </div>
        ))}
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

