import { Router, Request, Response } from 'express';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/Task';

const router = Router();

// In-memory storage (replace with database in production)
let tasks: Task[] = [];

// GET /api/tasks - Get all tasks
router.get('/', (req: Request, res: Response) => {
  res.json(tasks);
});

// GET /api/tasks/:id - Get a specific task
router.get('/:id', (req: Request, res: Response) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST /api/tasks - Create a new task
router.post('/', (req: Request<{}, {}, CreateTaskDto>, res: Response) => {
  const dto = req.body;
  
  if (!dto.title || !dto.day || !dto.timeSlot) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const now = new Date();
  const task: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: dto.title,
    description: dto.description,
    day: dto.day,
    timeSlot: dto.timeSlot,
    completed: false,
    color: dto.color || '#3b82f6',
    category: dto.category,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(task);
  res.status(201).json(task);
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', (req: Request<{ id: string }, {}, UpdateTaskDto>, res: Response) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updatedTask: Task = {
    ...tasks[taskIndex],
    ...req.body,
    updatedAt: new Date(),
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req: Request, res: Response) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// PATCH /api/tasks/:id/toggle - Toggle task completion
router.patch('/:id/toggle', (req: Request, res: Response) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    completed: !tasks[taskIndex].completed,
    updatedAt: new Date(),
  };

  res.json(tasks[taskIndex]);
});

export default router;

