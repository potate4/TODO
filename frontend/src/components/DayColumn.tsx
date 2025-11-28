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
    <div className="flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-full">
      {/* Day Header */}
      <div
        className={`
          sticky top-0 z-10 p-3 border-b-2 text-center
          ${isTodayDate
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }
        `}
      >
        <div
          className={`
            text-sm font-semibold uppercase
            ${isTodayDate ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}
          `}
        >
          {dayLabel.short}
        </div>
        <div
          className={`
            text-xs mt-1
            ${isTodayDate ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}
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

