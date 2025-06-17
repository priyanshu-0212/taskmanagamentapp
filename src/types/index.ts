export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  assignee?: User;
  createdBy: string;
  creator?: User;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'comment_added' | 'due_date_reminder';
  title: string;
  message: string;
  userId: string;
  taskId?: string;
  read: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}