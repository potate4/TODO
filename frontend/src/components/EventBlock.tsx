import { X } from 'lucide-react';
import type { Event } from '../types/planner';
import { usePlanner } from '../context/PlannerContext';

interface EventBlockProps {
  event: Event;
  onEdit?: (event: Event) => void;
}

export function EventBlock({ event, onEdit }: EventBlockProps) {
  const { deleteEvent } = usePlanner();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEvent(event.id);
  };

  const handleClick = () => {
    if (onEdit) {
      onEdit(event);
    }
  };

  const formatTimeRange = () => {
    if (event.isAllDay) {
      return 'All Day';
    }
    if (event.startTime && event.endTime) {
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${period}`;
      };
      return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
    }
    if (event.startTime) {
      const [hours, minutes] = event.startTime.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `From ${displayHour}:${minutes} ${period}`;
    }
    return '';
  };

  return (
    <div
      onClick={handleClick}
      className="
        group relative flex items-center gap-2 p-2 rounded-md mb-1.5
        border-l-4 cursor-pointer transition-all
        hover:shadow-md hover:scale-[1.01]
        bg-white dark:bg-gray-800
      "
      style={{ borderLeftColor: event.color }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {event.title}
        </div>
        {event.description && (
          <div className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
            {event.description}
          </div>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {formatTimeRange()}
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="
          flex-shrink-0 opacity-0 group-hover:opacity-100
          p-1 rounded hover:bg-red-100 dark:hover:bg-red-900
          transition-opacity
        "
        aria-label="Delete event"
      >
        <X size={14} className="text-red-500" />
      </button>
    </div>
  );
}

