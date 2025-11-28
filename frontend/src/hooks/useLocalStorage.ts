import { useState, useEffect, useCallback } from 'react';
import type { Task, Event } from '../types/planner';
import { saveTasksToStorage, loadTasksFromStorage, saveEventsToStorage, loadEventsFromStorage } from '../utils/storageUtils';

/**
 * Custom hook for managing tasks with localStorage persistence
 */
export function useLocalStorage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!isLoading) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, isLoading]);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  const moveTask = useCallback((taskId: string, newDay: string, newTimeSlot: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              day: newDay as Task['day'],
              timeSlot: newTimeSlot,
              updatedAt: new Date(),
            }
          : task
      )
    );
  }, []);

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    moveTask,
  };
}

/**
 * Custom hook for managing events with localStorage persistence
 */
export function useEventsStorage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load events from localStorage on mount
  useEffect(() => {
    const loadedEvents = loadEventsFromStorage();
    setEvents(loadedEvents);
    setIsLoading(false);
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (!isLoading) {
      saveEventsToStorage(events);
    }
  }, [events, isLoading]);

  const addEvent = useCallback((event: Event) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date() }
          : event
      )
    );
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}

