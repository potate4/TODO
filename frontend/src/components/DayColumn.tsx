import type { DayOfWeek } from '../types/planner';
import { DAY_LABELS } from '../types/planner';
import { generateTimeSlots } from '../utils/dateUtils';
import { isToday, formatDateShort, formatDateISO } from '../utils/dateUtils';
import { TimeSlot } from './TimeSlot';
import { EventsSection } from './EventsSection';
import { usePlanner } from '../context/PlannerContext';
import { Trash2 } from 'lucide-react';

interface DayColumnProps {
  date: Date;
}

export function DayColumn({ date }: DayColumnProps) {
  const { getEventsForDay, getTasksForDay, deleteTasksForDate } = usePlanner();
  const timeSlots = generateTimeSlots();
  const isTodayDate = isToday(date);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const dayMap: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const day = dayMap[dayOfWeek];
  const dayLabel = DAY_LABELS[day];
  const dateStr = formatDateShort(date);
  const events = getEventsForDay(day, date);
  const tasks = getTasksForDay(day, date);
  const eventCount = events.length;
  const taskCount = tasks.length;

  const handleDeleteDayTasks = () => {
    if (taskCount > 0 && confirm(`Are you sure you want to delete all ${taskCount} task${taskCount !== 1 ? 's' : ''} for this day?`)) {
      deleteTasksForDate(formatDateISO(date));
    }
  };

  return (
    <div className={`flex flex-col h-full ${
      isTodayDate 
        ? 'bg-gradient-to-b from-blue-50/30 via-blue-50/20 to-white dark:from-blue-900/20 dark:via-blue-900/10 dark:to-gray-900 border-l-2 border-r-2 border-blue-300 dark:border-blue-600' 
        : 'bg-white dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-600'
    }`}>
      {/* Day Header */}
      <div
        className={`
          sticky top-0 z-10 px-4 py-4 border-b-2 text-center backdrop-blur-md
          ${isTodayDate
            ? 'bg-gradient-to-b from-blue-50 via-blue-100/70 to-blue-50/50 dark:from-blue-900/50 dark:via-blue-800/30 dark:to-blue-900/20 border-blue-400/60 dark:border-blue-500/60 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 ring-1 ring-blue-200/30 dark:ring-blue-700/20'
            : 'bg-gradient-to-b from-gray-50/90 via-white to-gray-50/50 dark:from-gray-800/90 dark:via-gray-900 dark:to-gray-800/50 border-gray-300/60 dark:border-gray-600/60 shadow-sm'
          }
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleDeleteDayTasks}
            disabled={taskCount === 0}
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${taskCount > 0
                ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110 active:scale-95'
                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-40'
              }
            `}
            aria-label="Delete all tasks for this day"
          >
            <Trash2 size={16} />
          </button>
          <div className="flex items-center justify-center gap-2 flex-1">
            <div
              className={`
                text-sm font-extrabold uppercase tracking-widest
                ${isTodayDate ? 'text-blue-700 dark:text-blue-300 drop-shadow-sm' : 'text-gray-700 dark:text-gray-300'}
              `}
            >
              {dayLabel.short}
            </div>
            {eventCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold shadow-md shadow-red-500/30 ring-2 ring-red-500/20">
                {eventCount > 99 ? '99+' : eventCount}
              </span>
            )}
          </div>
          <div className="w-[28px]"></div>
        </div>
        <div
          className={`
            text-xs mt-1.5 font-bold
            ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
          `}
        >
          {isTodayDate ? 'Today' : dateStr}
        </div>
      </div>

      {/* Time Slots */}
      <div className="flex-1 min-h-0">
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot.time}
            day={day}
            date={date}
            timeSlot={slot.time}
            label={slot.label}
          />
        ))}
      </div>

      {/* Events Section */}
      <div className="flex-shrink-0">
        <EventsSection day={day} date={date} />
      </div>
    </div>
  );
}


