import { ChevronLeft, ChevronRight, CalendarDays, Trash2 } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { formatDateShort } from '../utils/dateUtils';

export function Header() {
  const { displayDates, goToToday, shiftDates, hasMoreDays, hasPreviousDays, deleteAllTasks } = usePlanner();

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL tasks? This action cannot be undone.')) {
      deleteAllTasks();
    }
  };

  const formatDateRange = () => {
    if (displayDates.length === 0) return 'No dates selected';
    const first = formatDateShort(displayDates[0]);
    const last = formatDateShort(displayDates[displayDates.length - 1]);
    return `${first} - ${last}`;
  };

  const handlePrevious = () => {
    shiftDates(-1);
  };

  const handleNext = () => {
    shiftDates(1);
  };

  return (
    <header className="bg-gradient-to-r from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 border-b-2 border-gray-200/80 dark:border-gray-700/80 sticky top-0 z-20 shadow-lg shadow-gray-900/5 dark:shadow-gray-900/50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
      <div className="w-full px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 ring-2 ring-blue-500/20 dark:ring-blue-400/10 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40">
                <CalendarDays className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent tracking-tight">
                Weekly Planner
              </h1>
            </div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-14 tracking-wide">
              {formatDateRange()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAll}
              className="px-5 py-2.5 rounded-xl border border-red-200/80 dark:border-red-800/50
                       bg-gradient-to-br from-white to-red-50/30 dark:from-gray-800 dark:to-red-900/10
                       text-red-600 dark:text-red-400
                       hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/30
                       hover:border-red-300 dark:hover:border-red-700
                       transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-500/10
                       hover:-translate-y-0.5 active:translate-y-0
                       flex items-center gap-2 font-semibold text-sm"
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>

            <div className="flex items-center gap-2 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/30 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-1 shadow-md ring-1 ring-gray-200/50 dark:ring-gray-700/50">
              <button
                onClick={handlePrevious}
                disabled={!hasPreviousDays}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400
                         hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600
                         hover:text-gray-900 dark:hover:text-white
                         transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
                         hover:scale-105 active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={goToToday}
                className="px-4 py-2 rounded-lg text-sm font-medium
                         text-gray-700 dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700
                         transition-all duration-200"
              >
                Today
              </button>

              <button
                onClick={handleNext}
                disabled={!hasMoreDays}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400
                         hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600
                         hover:text-gray-900 dark:hover:text-white
                         transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
                         hover:scale-105 active:scale-95"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
}

