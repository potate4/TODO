import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { formatDateShort, formatDateISO } from '../utils/dateUtils';

interface DatePickerProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  onClose: () => void;
}

export function DatePicker({ selectedDates, onDatesChange, onClose }: DatePickerProps) {
  const [tempDates, setTempDates] = useState<Date[]>(selectedDates);

  const handleDateToggle = (date: Date) => {
    const dateStr = formatDateISO(date);
    const isSelected = tempDates.some(d => formatDateISO(d) === dateStr);
    
    if (isSelected) {
      // Remove if already selected
      setTempDates(prev => prev.filter(d => formatDateISO(d) !== dateStr));
    } else {
      // Add if less than 7 selected
      if (tempDates.length < 7) {
        setTempDates(prev => [...prev, date].sort((a, b) => a.getTime() - b.getTime()));
      }
    }
  };

  const handleApply = () => {
    if (tempDates.length === 7) {
      onDatesChange(tempDates);
      onClose();
    }
  };

  const handleClear = () => {
    setTempDates([]);
  };

  // Generate calendar days (current month + next month)
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const days: Date[] = [];
    
    // Current month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Next month (first 14 days)
    for (let i = 1; i <= 14; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Select 7 Dates
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selected: {tempDates.length} / 7 dates
          </p>
          {tempDates.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tempDates.map((date) => (
                <span
                  key={date.getTime()}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                >
                  {formatDateShort(date)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-7 gap-2 max-h-96 overflow-y-auto">
          {calendarDays.map((date) => {
            const dateStr = formatDateISO(date);
            const isSelected = tempDates.some(d => formatDateISO(d) === dateStr);
            const isToday = dateStr === formatDateISO(new Date());
            
            return (
              <button
                key={dateStr}
                onClick={() => handleDateToggle(date)}
                disabled={!isSelected && tempDates.length >= 7}
                className={`
                  p-2 rounded text-sm transition-all
                  ${isSelected
                    ? 'bg-blue-600 text-white font-semibold'
                    : isToday
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                  ${!isSelected && tempDates.length >= 7 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleClear}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                     bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                     hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            disabled={tempDates.length !== 7}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md
                     hover:bg-blue-700 transition-colors font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply ({tempDates.length}/7)
          </button>
        </div>
      </div>
    </div>
  );
}

