import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { DayOfWeek, Event } from '../types/planner';
import { usePlanner } from '../context/PlannerContext';
import { EventBlock } from './EventBlock';
import { EventForm } from './EventForm';

interface EventsSectionProps {
  day: DayOfWeek;
}

export function EventsSection({ day }: EventsSectionProps) {
  const { getEventsForDay } = usePlanner();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const events = getEventsForDay(day);

  const handleAddClick = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEventEdit = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  return (
    <>
      <div className="border-b-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between p-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            {isCollapsed ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronUp size={14} />
            )}
            <span>Events {events.length > 0 && `(${events.length})`}</span>
          </button>
          {!isCollapsed && (
            <button
              onClick={handleAddClick}
              className="
                p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700
                transition-colors text-gray-500 dark:text-gray-400
                hover:text-gray-700 dark:hover:text-gray-300
              "
              aria-label="Add event"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="px-2 pb-2">
            {events.length > 0 ? (
              <div className="space-y-1.5">
                {events.map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    onEdit={handleEventEdit}
                  />
                ))}
              </div>
            ) : (
              <button
                onClick={handleAddClick}
                className="
                  w-full py-2 text-xs text-gray-400 dark:text-gray-500
                  hover:text-gray-600 dark:hover:text-gray-300
                  border border-dashed border-gray-300 dark:border-gray-600
                  rounded-md hover:border-gray-400 dark:hover:border-gray-500
                  transition-colors
                "
              >
                + Add event
              </button>
            )}
          </div>
        )}
      </div>

      {isFormOpen && (
        <EventForm
          event={editingEvent}
          day={day}
          onClose={handleFormClose}
        />
      )}
    </>
  );
}

