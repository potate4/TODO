import { usePlanner } from '../context/PlannerContext';
import { DayColumn } from './DayColumn';

export function WeekView() {
  const { displayDates } = usePlanner();

  return (
    <div className="w-full mx-auto px-24">
      <div className="flex">
        {displayDates.map((date) => (
          <div key={date.getTime()} className="flex-1 min-w-0">
            <DayColumn date={date} />
          </div>
        ))}
      </div>
    </div>
  );
}

