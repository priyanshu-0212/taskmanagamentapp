import { User, Task, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@taskflow.com',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@taskflow.com',
    role: 'manager',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@taskflow.com',
    role: 'member',
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily@taskflow.com',
    role: 'member',
    createdAt: new Date(),
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design Landing Page',
    description: 'Create a modern, responsive landing page for the new product launch with conversion optimization.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '2',
    assignee: mockUsers[1],
    createdBy: '1',
    creator: mockUsers[0],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(),
    tags: ['design', 'frontend', 'marketing'],
    comments: [
      {
        id: '1',
        taskId: '1',
        userId: '1',
        user: mockUsers[0],
        content: 'Please focus on mobile-first design approach',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ],
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Integrate payment gateway API with the checkout process and handle error scenarios.',
    status: 'review',
    priority: 'urgent',
    assigneeId: '3',
    assignee: mockUsers[2],
    createdBy: '1',
    creator: mockUsers[0],
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(),
    tags: ['backend', 'api', 'payment'],
    comments: [],
  },
  {
    id: '3',
    title: 'Database Optimization',
    description: 'Optimize database queries for better performance and add proper indexing.',
    status: 'todo',
    priority: 'medium',
    assigneeId: '4',
    assignee: mockUsers[3],
    createdBy: '2',
    creator: mockUsers[1],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(),
    tags: ['database', 'performance', 'backend'],
    comments: [],
  },
  {
    id: '4',
    title: 'User Testing',
    description: 'Conduct user testing sessions for the new features and gather feedback.',
    status: 'completed',
    priority: 'low',
    assigneeId: '2',
    assignee: mockUsers[1],
    createdBy: '1',
    creator: mockUsers[0],
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(),
    tags: ['testing', 'ux', 'research'],
    comments: [],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Design Landing Page"',
    userId: '2',
    taskId: '1',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: '2',
    type: 'due_date_reminder',
    title: 'Due Date Reminder',
    message: 'Task "API Integration" is due tomorrow',
    userId: '3',
    taskId: '2',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '3',
    type: 'task_completed',
    title: 'Task Completed',
    message: 'Sarah Wilson completed "User Testing"',
    userId: '1',
    taskId: '4',
    read: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
];