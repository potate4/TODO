import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { DayOfWeek, Event } from '../types/planner';
import { usePlanner } from '../context/PlannerContext';
import { EventBlock } from './EventBlock';
import { EventForm } from './EventForm';

interface EventsSectionProps {
  day: DayOfWeek;
  date: Date;
}

export function EventsSection({ day, date }: EventsSectionProps) {
  const { getEventsForDay } = usePlanner();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const events = getEventsForDay(day, date);

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
      <div className="border-t-2 border-gray-300 dark:border-gray-600 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/30 dark:to-gray-900 shadow-inner">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {isCollapsed ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronUp size={14} />
            )}
            <span>Events {events.length > 0 && <span className="text-gray-400 dark:text-gray-500">({events.length})</span>}</span>
          </button>
          {!isCollapsed && (
            <button
              onClick={handleAddClick}
              className="
                p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700
                transition-all duration-200 text-gray-500 dark:text-gray-400
                hover:text-gray-700 dark:hover:text-gray-300 hover:scale-110
              "
              aria-label="Add event"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="px-4 pb-4">
            {events.length > 0 ? (
              <div className="space-y-2">
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
                  w-full py-3 text-xs font-medium text-gray-400 dark:text-gray-500
                  hover:text-gray-600 dark:hover:text-gray-300
                  border-2 border-dashed border-gray-200 dark:border-gray-700
                  rounded-lg hover:border-gray-300 dark:hover:border-gray-600
                  hover:bg-gray-50 dark:hover:bg-gray-800/50
                  transition-all duration-200
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
          date={date}
          onClose={handleFormClose}
        />
      )}
    </>
  );
}

