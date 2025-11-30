import { usePlanner } from '../context/PlannerContext';
import { DayColumn } from './DayColumn';

export function WeekView() {
  const { displayDates } = usePlanner();

  return (
    <div className="w-full mx-auto px-24 flex justify-center">
      <div className="flex items-stretch">
        {displayDates.map((date) => (
          <div key={date.getTime()} className="flex-shrink-0 w-[300px]">
            <DayColumn date={date} />
          </div>
        ))}
      </div>
    </div>
  );
}

