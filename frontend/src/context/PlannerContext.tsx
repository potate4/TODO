import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Task, DayOfWeek, Event } from '../types/planner';
import { useLocalStorage, useEventsStorage } from '../hooks/useLocalStorage';
import { getWeekStart, getPreviousWeek, getNextWeek, getDateForDay, formatDateISO } from '../utils/dateUtils';

interface PlannerContextType {
  // Date selection
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  goToWeek: (weekStart: Date) => void;
  goToToday: () => void;
  shiftDates: (days: number) => void;
  
  // Tasks
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  moveTask: (taskId: string, newDay: DayOfWeek, newDate: Date, newTimeSlot: string) => void;
  
  // Task queries
  getTasksForDay: (day: DayOfWeek, date: Date) => Task[];
  getTasksForTimeSlot: (day: DayOfWeek, date: Date, timeSlot: string) => Task[];
  
  // Task creation helper
  createTask: (
    title: string,
    day: DayOfWeek,
    timeSlot: string,
    color?: string,
    description?: string,
    category?: string
  ) => Task;
  
  // Events
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDay: (day: DayOfWeek, date: Date) => Event[];
  createEvent: (
    title: string,
    day: DayOfWeek,
    color?: string,
    description?: string,
    isAllDay?: boolean,
    startTime?: string,
    endTime?: string
  ) => Event;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  // Initialize with current week (7 days)
  const initializeDates = useCallback(() => {
    const weekStart = getWeekStart();
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  const [selectedDates, setSelectedDates] = useState<Date[]>(initializeDates);
  
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    moveTask: moveTaskStorage,
  } = useLocalStorage();
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEventsStorage();

  const goToWeek = useCallback((weekStart: Date) => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    setSelectedDates(dates);
  }, []);

  const goToToday = useCallback(() => {
    const weekStart = getWeekStart();
    goToWeek(weekStart);
  }, [goToWeek]);

  const shiftDates = useCallback((days: number) => {
    setSelectedDates(prev => 
      prev.map(date => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      })
    );
  }, []);

  const getTasksForDay = useCallback(
    (day: DayOfWeek, date: Date): Task[] => {
      const dateStr = formatDateISO(date);
      return tasks.filter(task => task.date === dateStr);
    },
    [tasks]
  );

  const getTasksForTimeSlot = useCallback(
    (day: DayOfWeek, date: Date, timeSlot: string): Task[] => {
      const dateStr = formatDateISO(date);
      return tasks.filter(
        task => task.date === dateStr && task.timeSlot === timeSlot
      );
    },
    [tasks]
  );

  const createTask = useCallback(
    (
      title: string,
      day: DayOfWeek,
      date: Date,
      timeSlot: string,
      color: string = '#3b82f6',
      description?: string,
      category?: string
    ): Task => {
      const now = new Date();
      return {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        day,
        date: formatDateISO(date),
        timeSlot,
        completed: false,
        color,
        category,
        createdAt: now,
        updatedAt: now,
      };
    },
    []
  );

  const moveTask = useCallback(
    (taskId: string, newDay: DayOfWeek, newDate: Date, newTimeSlot: string) => {
      moveTaskStorage(taskId, newDay, formatDateISO(newDate), newTimeSlot);
    },
    [moveTaskStorage]
  );

  const getEventsForDay = useCallback(
    (day: DayOfWeek, date: Date): Event[] => {
      const dateStr = formatDateISO(date);
      return events.filter(event => event.date === dateStr);
    },
    [events]
  );

  const createEvent = useCallback(
    (
      title: string,
      day: DayOfWeek,
      date: Date,
      color: string = '#3b82f6',
      description?: string,
      isAllDay: boolean = true,
      startTime?: string,
      endTime?: string
    ): Event => {
      const now = new Date();
      return {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        day,
        date: formatDateISO(date),
        isAllDay,
        startTime,
        endTime,
        color,
        createdAt: now,
        updatedAt: now,
      };
    },
    []
  );

  const value: PlannerContextType = {
    selectedDates,
    setSelectedDates,
    goToWeek,
    goToToday,
    shiftDates,
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    moveTask,
    getTasksForDay,
    getTasksForTimeSlot,
    createTask,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
    createEvent,
  };

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}

