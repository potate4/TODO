import type { DayOfWeek } from '../types/planner';
import { DAY_LABELS } from '../types/planner';
import { generateTimeSlots } from '../utils/dateUtils';
import { getDateForDay, isToday, formatDateShort } from '../utils/dateUtils';
import { usePlanner } from '../context/PlannerContext';
import { TimeSlot } from './TimeSlot';
import { EventsSection } from './EventsSection';

interface DayColumnProps {
  day: DayOfWeek;
}

export function DayColumn({ day }: DayColumnProps) {
  const { currentWeekStart } = usePlanner();
  const timeSlots = generateTimeSlots();
  const date = getDateForDay(currentWeekStart, day);
  const isTodayDate = isToday(date);
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
            ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
          `}
        >
          {dateStr}
        </div>
        {isTodayDate && (
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
            Today
          </div>
        )}
      </div>

      {/* Events Section */}
      <EventsSection day={day} />

      {/* Time Slots */}
      <div>
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot.time}
            day={day}
            timeSlot={slot.time}
            label={slot.label}
          />
        ))}
      </div>
    </div>
  );
}

