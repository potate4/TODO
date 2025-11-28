import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { formatDateShort } from '../utils/dateUtils';
import { DatePicker } from './DatePicker';

export function Header() {
  const { selectedDates, setSelectedDates, goToToday, shiftDates } = usePlanner();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const formatDateRange = () => {
    if (selectedDates.length === 0) return 'No dates selected';
    const first = formatDateShort(selectedDates[0]);
    const last = formatDateShort(selectedDates[selectedDates.length - 1]);
    return `${first} - ${last}`;
  };

  const handlePreviousDay = () => {
    shiftDates(-1);
  };

  const handleNextDay = () => {
    shiftDates(1);
  };

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
              {formatDateRange()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors
                       flex items-center gap-2"
            >
              <Calendar size={16} />
              <span>Select Dates</span>
            </button>

            <button
              onClick={handlePreviousDay}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              aria-label="Previous day"
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
              onClick={handleNextDay}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              aria-label="Next day"
            >
              <ChevronRight size={20} />
            </button>
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

