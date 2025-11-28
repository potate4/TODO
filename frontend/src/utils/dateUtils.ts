import type { DayOfWeek, TimeSlot } from '../types/planner';
import { DAYS_OF_WEEK, DAY_LABELS } from '../types/planner';

/**
 * Get the Saturday of the week containing the given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday
  // Calculate days to subtract to get to Saturday
  // If day is 0 (Sunday), subtract 1 day
  // If day is 1-6, subtract (day + 1) days
  const daysToSubtract = day === 0 ? 1 : day + 1;
  d.setDate(d.getDate() - daysToSubtract);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the date for a specific day of the week in the current week
 */
export function getDateForDay(weekStart: Date, day: DayOfWeek): Date {
  const dayIndex = DAYS_OF_WEEK.indexOf(day);
  const date = new Date(weekStart);
  date.setDate(date.getDate() + dayIndex);
  return date;
}

/**
 * Format date as "MMM DD" (e.g., "Nov 28")
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format date as "Month DD, YYYY" (e.g., "November 28, 2025")
 */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Format week range (e.g., "Nov 28 - Dec 4, 2025")
 */
export function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const startStr = formatDateShort(weekStart);
  const endStr = formatDateShort(weekEnd);
  const year = weekStart.getFullYear();
  
  return `${startStr} - ${endStr}, ${year}`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Generate time slots from 6:00 AM to 11:00 PM
 */
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  for (let hour = 6; hour <= 23; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const label = `${displayHour}:00 ${period}`;
    
    slots.push({
      hour,
      label,
      time: timeString,
    });
  }
  
  return slots;
}

/**
 * Navigate to previous week
 */
export function getPreviousWeek(weekStart: Date): Date {
  const newDate = new Date(weekStart);
  newDate.setDate(newDate.getDate() - 7);
  return newDate;
}

/**
 * Navigate to next week
 */
export function getNextWeek(weekStart: Date): Date {
  const newDate = new Date(weekStart);
  newDate.setDate(newDate.getDate() + 7);
  return newDate;
}

/**
 * Get day of week from date
 */
export function getDayOfWeek(date: Date): DayOfWeek {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  // Map: 0 (Sun) -> 'sun', 1 (Mon) -> 'mon', ..., 6 (Sat) -> 'sat'
  const dayMap: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return dayMap[day];
}

/**
 * Check if two dates are in the same week
 */
export function isSameWeek(date1: Date, date2: Date): boolean {
  const weekStart1 = getWeekStart(date1);
  const weekStart2 = getWeekStart(date2);
  return weekStart1.getTime() === weekStart2.getTime();
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse ISO date string to Date object
 */
export function parseDateISO(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

