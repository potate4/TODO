import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Task, DayOfWeek } from '../types/planner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getWeekStart, getPreviousWeek, getNextWeek, getDateForDay } from '../utils/dateUtils';

interface PlannerContextType {
  // Week navigation
  currentWeekStart: Date;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToToday: () => void;
  
  // Tasks
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  moveTask: (taskId: string, newDay: DayOfWeek, newTimeSlot: string) => void;
  
  // Task queries
  getTasksForDay: (day: DayOfWeek) => Task[];
  getTasksForTimeSlot: (day: DayOfWeek, timeSlot: string) => Task[];
  
  // Task creation helper
  createTask: (
    title: string,
    day: DayOfWeek,
    timeSlot: string,
    color?: string,
    description?: string,
    category?: string
  ) => Task;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart());
  const {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    moveTask: moveTaskStorage,
  } = useLocalStorage();

  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => getPreviousWeek(prev));
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => getNextWeek(prev));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentWeekStart(getWeekStart());
  }, []);

  const getTasksForDay = useCallback(
    (day: DayOfWeek): Task[] => {
      return tasks.filter(task => task.day === day);
    },
    [tasks]
  );

  const getTasksForTimeSlot = useCallback(
    (day: DayOfWeek, timeSlot: string): Task[] => {
      return tasks.filter(
        task => task.day === day && task.timeSlot === timeSlot
      );
    },
    [tasks]
  );

  const createTask = useCallback(
    (
      title: string,
      day: DayOfWeek,
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
    (taskId: string, newDay: DayOfWeek, newTimeSlot: string) => {
      moveTaskStorage(taskId, newDay, newTimeSlot);
    },
    [moveTaskStorage]
  );

  const value: PlannerContextType = {
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek,
    goToToday,
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

