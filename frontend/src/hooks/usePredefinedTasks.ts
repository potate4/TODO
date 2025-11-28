import { useState, useEffect, useCallback } from 'react';
import type { PredefinedTask } from '../types/planner';
import { savePredefinedTasksToStorage, loadPredefinedTasksFromStorage } from '../utils/storageUtils';

export function usePredefinedTasks() {
  const [tasks, setTasks] = useState<PredefinedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTasks = loadPredefinedTasksFromStorage();
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      savePredefinedTasksToStorage(tasks);
    }
  }, [tasks, isLoading]);

  const addTask = useCallback((task: PredefinedTask) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<PredefinedTask>) => {
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

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
  };
}

