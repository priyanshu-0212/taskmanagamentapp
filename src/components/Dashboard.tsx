import React from 'react';
import { 
  CheckSquare, 
  Clock, 
  Users, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Activity,
  Target
} from 'lucide-react';
import { Task, User } from '../types';
import { TaskCard } from './TaskCard';

interface DashboardProps {
  tasks: Task[];
  user: User;
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  tasks, 
  user, 
  onTaskClick, 
  onStatusChange 
}) => {
  const userTasks = tasks.filter(task => task.assigneeId === user.id);
  const completedTasks = userTasks.filter(task => task.status === 'completed');
  const inProgressTasks = userTasks.filter(task => task.status === 'in-progress');
  const overdueTasks = userTasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < new Date() && 
    task.status !== 'completed'
  );

  const recentTasks = userTasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const stats = [
    {
      title: 'Total Tasks',
      value: userTasks.length,
      icon: CheckSquare,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: Target,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'In Progress',
      value: inProgressTasks.length,
      icon: Activity,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Overdue',
      value: overdueTasks.length,
      icon: AlertCircle,
      color: 'bg-red-500',
      change: '-2%',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-indigo-100">
          You have {inProgressTasks.length} tasks in progress and {overdueTasks.length} overdue tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
            Task Distribution
          </h3>
          <div className="space-y-3">
            {[
              { status: 'todo', label: 'To Do', count: tasks.filter(t => t.status === 'todo').length, color: 'bg-gray-200' },
              { status: 'in-progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in-progress').length, color: 'bg-blue-200' },
              { status: 'review', label: 'Review', count: tasks.filter(t => t.status === 'review').length, color: 'bg-purple-200' },
              { status: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length, color: 'bg-green-200' },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-600" />
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {userTasks
              .filter(task => task.dueDate && task.status !== 'completed')
              .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
              .slice(0, 4)
              .map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200" onClick={() => onTaskClick(task)}>
                  <div className="w-3 h-3 rounded-full bg-orange-200"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Team Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Team Activity
          </h3>
          <div className="space-y-3">
            {tasks
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 4)
              .map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {task.assignee?.name.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{task.assignee?.name || 'Someone'}</span> updated{' '}
                      <span className="font-medium">{task.title}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(task.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Recent Tasks</h3>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors duration-200">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
        
        {recentTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tasks assigned to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};