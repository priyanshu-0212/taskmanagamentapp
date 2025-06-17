import React from 'react';
import { Calendar, User, MessageCircle, Flag, Clock } from 'lucide-react';
import { Task } from '../types';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick, onStatusChange }) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDueDate = (dueDate: Date) => {
    if (isToday(dueDate)) return 'Today';
    if (isTomorrow(dueDate)) return 'Tomorrow';
    return format(dueDate, 'MMM d');
  };

  const getDueDateColor = (dueDate: Date) => {
    if (isPast(dueDate) && task.status !== 'completed') return 'text-red-600';
    if (isToday(dueDate)) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-indigo-200 group"
      onClick={() => onTaskClick(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {task.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          {/* Assignee */}
          {task.assignee && (
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {task.assignee.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-600">{task.assignee.name}</span>
            </div>
          )}

          {/* Comments */}
          {task.comments.length > 0 && (
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{task.comments.length}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center space-x-1 ${getDueDateColor(task.dueDate)}`}>
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">{formatDueDate(task.dueDate)}</span>
            </div>
          )}

          {/* Status */}
          <select
            value={task.status}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, e.target.value as Task['status']);
            }}
            className={`text-xs px-2 py-1 rounded-md border-0 ${getStatusColor(task.status)} font-medium focus:ring-2 focus:ring-indigo-500`}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};