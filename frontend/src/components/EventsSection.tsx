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
      <div className="border-t-2 border-gray-300/60 dark:border-gray-600/60 bg-gradient-to-b from-gray-50/70 via-gray-100/30 to-white dark:from-gray-800/40 dark:via-gray-800/20 dark:to-gray-900 shadow-inner backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-300 hover:scale-105"
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
                p-1.5 rounded-xl hover:bg-gradient-to-br hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600
                transition-all duration-300 text-gray-500 dark:text-gray-400
                hover:text-gray-700 dark:hover:text-gray-300 hover:scale-110 active:scale-95
                shadow-sm hover:shadow-md
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

