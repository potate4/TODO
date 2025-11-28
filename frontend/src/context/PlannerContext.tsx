import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Task, DayOfWeek, Event, PredefinedTask } from '../types/planner';
import { useLocalStorage, useEventsStorage } from '../hooks/useLocalStorage';
import { usePredefinedTasks } from '../hooks/usePredefinedTasks';
import { getWeekStart, getPreviousWeek, getNextWeek, getDateForDay, formatDateISO } from '../utils/dateUtils';

interface PlannerContextType {
  // Date selection
  selectedDates: Date[];
  displayDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  goToWeek: (weekStart: Date) => void;
  goToToday: () => void;
  shiftDates: (days: number) => void;
  hasMoreDays: boolean;
  hasPreviousDays: boolean;
  
  // Tasks
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  deleteAllTasks: () => void;
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
    date: Date,
    color?: string,
    description?: string,
    isAllDay?: boolean,
    startTime?: string,
    endTime?: string
  ) => Event;

  // Predefined Tasks
  predefinedTasks: PredefinedTask[];
  addPredefinedTask: (task: PredefinedTask) => void;
  updatePredefinedTask: (id: string, updates: Partial<PredefinedTask>) => void;
  deletePredefinedTask: (id: string) => void;
  createPredefinedTask: (
    title: string,
    color?: string,
    description?: string,
    category?: string
  ) => PredefinedTask;
  createTaskFromPredefined: (predefinedTask: PredefinedTask, day: DayOfWeek, date: Date, timeSlot: string) => Task;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  // Initialize with 3 weeks before today + today + 3 weeks after (49 days total, but we'll show 5 at a time)
  const initializeDates = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates: Date[] = [];
    // Start 3 weeks (21 days) before today
    for (let i = -21; i < 22; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  const [selectedDates, setSelectedDates] = useState<Date[]>(initializeDates);
  const [currentOffset, setCurrentOffset] = useState(0);
  
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
    toggleTaskComplete,
    moveTask: moveTaskStorage,
  } = useLocalStorage();
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEventsStorage();

  const {
    tasks: predefinedTasks,
    addTask: addPredefinedTask,
    updateTask: updatePredefinedTask,
    deleteTask: deletePredefinedTask,
  } = usePredefinedTasks();

  const goToWeek = useCallback((weekStart: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(weekStart);
    start.setHours(0, 0, 0, 0);
    
    // Always maintain 3 weeks before today + today + 3 weeks after
    // But center the view around the selected week start
    const dates: Date[] = [];
    // Start 3 weeks (21 days) before today
    for (let i = -21; i < 22; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    setSelectedDates(dates);
    
    // Find the selected week start in the dates array and set offset
    const weekStartIndex = dates.findIndex(d => {
      const dStr = formatDateISO(d);
      const startStr = formatDateISO(start);
      return dStr === startStr;
    });
    
    if (weekStartIndex !== -1) {
      setCurrentOffset(Math.min(weekStartIndex, dates.length - 5));
    } else {
      setCurrentOffset(0);
    }
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create 3 weeks before today + today + 3 weeks after (49 days total)
    const dates: Date[] = [];
    // Start 3 weeks (21 days) before today
    for (let i = -21; i < 22; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    setSelectedDates(dates);
    
    // Find today's index (should be at index 21) and set offset so today is first (leftmost)
    const todayIndex = dates.findIndex(d => {
      const dStr = formatDateISO(d);
      const todayStr = formatDateISO(today);
      return dStr === todayStr;
    });
    
    if (todayIndex !== -1) {
      // Set offset so today is the first visible day (leftmost)
      setCurrentOffset(todayIndex);
    } else {
      setCurrentOffset(0);
    }
  }, []);

  const shiftDates = useCallback((days: number) => {
    setCurrentOffset(prev => {
      const newOffset = prev + days;
      // Limit offset to show all 15 days (0-10 for 5-day view)
      if (newOffset < 0) return 0;
      const maxOffset = selectedDates.length - 5;
      if (newOffset > maxOffset) return maxOffset;
      return newOffset;
    });
  }, [selectedDates.length]);

  // Get the 5 days to display based on current offset
  const getDisplayDates = useCallback(() => {
    return selectedDates.slice(currentOffset, currentOffset + 5);
  }, [selectedDates, currentOffset]);

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

  const createPredefinedTask = useCallback(
    (
      title: string,
      color: string = '#3b82f6',
      description?: string,
      category?: string
    ): PredefinedTask => {
      const now = new Date();
      return {
        id: `predefined-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        color,
        category,
        createdAt: now,
        updatedAt: now,
      };
    },
    []
  );

  const createTaskFromPredefined = useCallback(
    (predefinedTask: PredefinedTask, day: DayOfWeek, date: Date, timeSlot: string): Task => {
      return createTask(
        predefinedTask.title,
        day,
        date,
        timeSlot,
        predefinedTask.color,
        predefinedTask.description,
        predefinedTask.category
      );
    },
    [createTask]
  );

  const displayDates = getDisplayDates();
  const maxOffset = Math.max(0, selectedDates.length - 5);
  const hasMoreDays = currentOffset < maxOffset;
  const hasPreviousDays = currentOffset > 0;

  const value: PlannerContextType = {
    selectedDates,
    displayDates,
    setSelectedDates,
    goToWeek,
    goToToday,
    shiftDates,
    hasMoreDays,
    hasPreviousDays,
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    deleteAllTasks,
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
    predefinedTasks,
    addPredefinedTask,
    updatePredefinedTask,
    deletePredefinedTask,
    createPredefinedTask,
    createTaskFromPredefined,
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

