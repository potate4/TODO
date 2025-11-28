import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Trash2 } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { formatDateShort } from '../utils/dateUtils';
import { DatePicker } from './DatePicker';

export function Header() {
  const { selectedDates, displayDates, setSelectedDates, goToToday, shiftDates, hasMoreDays, hasPreviousDays, deleteAllTasks } = usePlanner();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
    <header className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b-2 border-gray-300 dark:border-gray-600 sticky top-0 z-20 shadow-md">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
                <CalendarDays className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Weekly Planner
              </h1>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-14">
              {formatDateRange()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearAll}
              className="px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-800
                       bg-white dark:bg-gray-800 text-red-600 dark:text-red-400
                       hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700
                       transition-all duration-200 shadow-sm hover:shadow-md
                       flex items-center gap-2 font-medium text-sm"
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>

            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600
                       transition-all duration-200 shadow-sm hover:shadow-md
                       flex items-center gap-2 font-medium text-sm"
            >
              <Calendar size={16} />
              <span>Select Dates</span>
            </button>

            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
              <button
                onClick={handlePrevious}
                disabled={!hasPreviousDays}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white
                         transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
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
                         hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white
                         transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDatePickerOpen && (
        <DatePicker
          selectedDates={selectedDates}
          onDatesChange={setSelectedDates}
          onClose={() => setIsDatePickerOpen(false)}
        />
      )}
    </header>
  );
}

