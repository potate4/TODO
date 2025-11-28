export interface Task {
  id: string;
  userId?: string; // For future multi-user support
  title: string;
  description?: string;
  day: 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
  timeSlot: string; // Format: '06:00', '07:00', etc.
  completed: boolean;
  color: string; // hex color code
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  day: Task['day'];
  timeSlot: string;
  color?: string;
  category?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  day?: Task['day'];
  timeSlot?: string;
  completed?: boolean;
  color?: string;
  category?: string;
}

