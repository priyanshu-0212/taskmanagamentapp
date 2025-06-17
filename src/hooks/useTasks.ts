import { useState, useEffect } from 'react';
import { Task } from '../types';
import { mockTasks, mockUsers } from '../utils/mockData';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 500);
  }, []);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      assignee: taskData.assigneeId ? mockUsers.find(u => u.id === taskData.assigneeId) : undefined,
      creator: mockUsers.find(u => u.id === taskData.createdBy),
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            ...updates, 
            updatedAt: new Date(),
            assignee: updates.assigneeId ? mockUsers.find(u => u.id === updates.assigneeId) : task.assignee,
          }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByAssignee = (assigneeId: string) => {
    return tasks.filter(task => task.assigneeId === assigneeId);
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTasksByAssignee,
  };
};