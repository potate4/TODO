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

  // Convert hex to rgba with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div
      onClick={handleClick}
      className="
        group relative flex items-center gap-3 p-3 rounded-xl mb-2
        border-l-[4px] cursor-pointer transition-all duration-300
        hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30
        hover:-translate-y-1 hover:scale-[1.02]
        border-gray-200/80 dark:border-gray-700/80 shadow-md shadow-black/5 dark:shadow-black/20 ring-1 ring-gray-200/50 dark:ring-gray-700/30
      "
      style={{ 
        borderLeftColor: event.color,
        backgroundColor: hexToRgba(event.color, 0.1),
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate leading-tight">
          {event.title}
        </div>
        {event.description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1.5 leading-relaxed">
            {event.description}
          </div>
        )}
        <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-wide">
          {formatTimeRange()}
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="
          flex-shrink-0 opacity-0 group-hover:opacity-100
          p-1.5 rounded-lg hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/20
          transition-all duration-300 hover:scale-110 active:scale-95
          hover:shadow-sm hover:shadow-red-500/20
        "
        aria-label="Delete event"
      >
        <X size={14} className="text-red-500 dark:text-red-400" />
      </button>
    </div>
  );
}

