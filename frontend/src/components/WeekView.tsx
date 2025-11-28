import { usePlanner } from '../context/PlannerContext';
import { DayColumn } from './DayColumn';

export function WeekView() {
  const { displayDates } = usePlanner();

  return (
    <div className="w-full mx-auto px-24">
      <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {displayDates.map((date) => (
          <div key={date.getTime()} className="flex-shrink-0 w-[300px] mr-2">
            <DayColumn date={date} />
          </div>
        ))}
      </div>
    </div>
  );
}

