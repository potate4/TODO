export interface Task {
  id: string;
  title: string;
  description?: string;
  day: DayOfWeek;      // Kept for backward compatibility and display
  date: string;        // ISO date string (YYYY-MM-DD) - primary identifier
  timeSlot: string;   // Format: '06:00', '07:00', etc.
  completed: boolean;
  color: string;      // hex color code
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  day: DayOfWeek;      // Kept for backward compatibility and display
  date: string;        // ISO date string (YYYY-MM-DD) - primary identifier
  isAllDay: boolean;
  startTime?: string;  // Format: '06:00' - only if not all day
  endTime?: string;    // Format: '18:00' - only if not all day
  color: string;       // hex color code
  createdAt: Date;
  updatedAt: Date;
}

export type DayOfWeek = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export interface WeekData {
  weekStart: Date;
  tasks: Task[];
}

export interface TimeSlot {
  hour: number;
  label: string;
  time: string; // Format: '06:00'
}

export interface DayColumnData {
  day: DayOfWeek;
  date: Date;
  label: string;
  shortLabel: string;
}

export const DAYS_OF_WEEK: DayOfWeek[] = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];

export const DAY_LABELS: Record<DayOfWeek, { full: string; short: string }> = {
  sat: { full: 'Saturday', short: 'Sat' },
  sun: { full: 'Sunday', short: 'Sun' },
  mon: { full: 'Monday', short: 'Mon' },
  tue: { full: 'Tuesday', short: 'Tue' },
  wed: { full: 'Wednesday', short: 'Wed' },
  thu: { full: 'Thursday', short: 'Thu' },
  fri: { full: 'Friday', short: 'Fri' },
};

export interface PredefinedTask {
  id: string;
  title: string;
  description?: string;
  color: string;       // hex color code
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_TASK_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
];

