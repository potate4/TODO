import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { formatWeekRange } from '../utils/dateUtils';

export function Header() {
  const { currentWeekStart, goToPreviousWeek, goToNextWeek, goToToday } = usePlanner();
  const weekRange = formatWeekRange(currentWeekStart);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <CalendarDays className="text-blue-600 dark:text-blue-400" size={28} />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Weekly Planner
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {weekRange}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors
                       flex items-center gap-2"
            >
              <Calendar size={16} />
              <span>Today</span>
            </button>

            <button
              onClick={goToNextWeek}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              aria-label="Next week"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

