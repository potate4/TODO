import type { DayOfWeek } from '../types/planner';
import { DAY_LABELS } from '../types/planner';
import { generateTimeSlots } from '../utils/dateUtils';
import { isToday, formatDateShort } from '../utils/dateUtils';
import { TimeSlot } from './TimeSlot';
import { EventsSection } from './EventsSection';

interface DayColumnProps {
  date: Date;
}

export function DayColumn({ date }: DayColumnProps) {
  const timeSlots = generateTimeSlots();
  const isTodayDate = isToday(date);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const dayMap: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const day = dayMap[dayOfWeek];
  const dayLabel = DAY_LABELS[day];
  const dateStr = formatDateShort(date);

  return (
    <div className="flex flex-col border-r-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 min-h-[calc(100vh-180px)] shadow-md">
      {/* Day Header */}
      <div
        className={`
          sticky top-0 z-10 px-4 py-4 border-b-2 text-center backdrop-blur-sm
          ${isTodayDate
            ? 'bg-gradient-to-b from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-800/20 border-blue-300 dark:border-blue-600 shadow-sm'
            : 'bg-gradient-to-b from-gray-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 border-gray-300 dark:border-gray-600'
          }
        `}
      >
        <div
          className={`
            text-sm font-bold uppercase tracking-wider
            ${isTodayDate ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}
          `}
        >
          {dayLabel.short}
        </div>
        <div
          className={`
            text-xs mt-1.5 font-medium
            ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
          `}
        >
          {isTodayDate ? 'Today' : dateStr}
        </div>
      </div>

      {/* Time Slots */}
      <div>
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
      <EventsSection day={day} date={date} />
    </div>
  );
}

