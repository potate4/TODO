import type { Task, WeekData, Event } from '../types/planner';

const STORAGE_KEY = 'weekly-planner-data';
const EVENTS_STORAGE_KEY = 'weekly-planner-events';

/**
 * Save tasks to localStorage
 */
export function saveTasksToStorage(tasks: Task[]): void {
  try {
    const serialized = JSON.stringify(tasks.map(task => ({
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    })));
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

/**
 * Load tasks from localStorage
 */
export function loadTasksFromStorage(): Task[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return [];
    }
    
    const data = JSON.parse(serialized);
    return data.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    })) as Task[];
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return [];
  }
}

/**
 * Clear all tasks from localStorage
 */
export function clearTasksFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear tasks from localStorage:', error);
  }
}

/**
 * Get storage size (for debugging)
 */
export function getStorageSize(): number {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? new Blob([data]).size : 0;
  } catch {
    return 0;
  }
}

/**
 * Save events to localStorage
 */
export function saveEventsToStorage(events: Event[]): void {
  try {
    const serialized = JSON.stringify(events.map(event => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    })));
    localStorage.setItem(EVENTS_STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save events to localStorage:', error);
  }
}

/**
 * Load events from localStorage
 */
export function loadEventsFromStorage(): Event[] {
  try {
    const serialized = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!serialized) {
      return [];
    }
    
    const data = JSON.parse(serialized);
    return data.map((event: any) => ({
      ...event,
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
    })) as Event[];
  } catch (error) {
    console.error('Failed to load events from localStorage:', error);
    return [];
  }
}

